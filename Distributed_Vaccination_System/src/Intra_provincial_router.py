from collections import defaultdict
from os import error
import socket
import threading
import csv
import sys
import time
import re
from _thread import *
from typing import DefaultDict
from queue import Queue
import MMU


PACKAGE_MAX_CAPACITY = 1024

config_file_name = "./red_conf.csv"
intergroup_connection = 1

# Initializing the Graph Class
# Codigo adaptado de: https://pythonwife.com/dijkstras-algorithm-in-python/.
class Graph:
  def __init__(self):
    self.nodes = set()
    self.edges = defaultdict(list)
    self.distances = {}
  
  def addNode(self,value):
    self.nodes.add(value)
  
  def addEdge(self, fromNode, toNode, distance):
    self.edges[fromNode].append(toNode)
    self.distances[(fromNode, toNode)] = distance

class Intra_provincial_router:
  def __init__(self, node, subnode):
    # Codigo de Emma.
    self.province = None
    self.canton = None
    self.IP_Address = None   # Build router IP Address
    self.port = None
    self.im_border_router = False    # Bool variable if i'm the router connected with the province.
    # Assign province number for this router.
    if int(node) < 10:
      self.province = "0"
      self.province += str(node)
    else:
      self.province += str(node)
    # Assign canton number for this router.
    if int(subnode) < 10:
      self.canton = "0"
      self.canton += str(subnode)
    else:
      self.canton += str(subnode)
    # Main Router Data
    self.IP_Address = str(self.province + "." + self.canton + ".0")
    self.province_cost = None
    self.province_port = None
    self.province_IP = str(self.province + ".00.0")

    # Memory Data
    logincIntIp =  int(re.sub("\.", "", self.IP_Address))
    self.memory = MMU.MMU(logincIntIp)
    self.routing_tables_ports = list()

    # Implementation of Link State Algorithm.
    self.all_canton_info = dict()
    self.my_graph = Graph()
    
    # Codigo de Gilbert.
    self.lock = threading.Lock()
    self.connections = self.read_from_conf_file()
    #print(self.connections)
    self.sockets = []

    # Queue for messages received (input queue)
    self.switch_queue = Queue()
    self.output_queues = []
    for index in range(len(self.connections["IP"])):
      self.output_queues.append(Queue())
      #print("Creating queues")
    # routing_table
    # ports[]
    # cantonal_router_port
    # input_queues[]
    # output_queues[]
    # each pair of input/output queues share a socket, so a router can't send an receive paralelly in a pair of queues 
    # sockets[]
    # Bind o Connect de cada socket

  def build_Logic_IP(self):
    if(int(sys.argv[1]) > 9):
      logic_IP = sys.argv[1] + ".00.0"
    else:
      logic_IP = "0"+ sys.argv[1] + ".00.0"
    return logic_IP

  def read_from_conf_file(self):
    # My logical IP to find my info in the file
    logical_IP = self.IP_Address.replace(".", " ")

    # Patterns for regular expressions
    edges_pattern = "(\d{2} \d{2} \d,){2}\d+,\d{4,5}"
    # Dictionary of ports to return
    connections = {"IP":[],"Cost":[],"doBind":[],"Port":[]}

    # File to read
    file = open("red_conf.csv", "r")
    Lines = file.readlines()
    
    for line in Lines:
      line = line.strip()
      if (re.search(edges_pattern, line)):
        if(line.find(logical_IP) != -1):
          if(line[0:7] == logical_IP):
            # Do Bind
            connections["IP"].append(line[8:15])
            last_cost_byte = self.find_last_cost_byte(line,16)
            connections["Cost"].append(line[16:last_cost_byte])
            first_port_byte = last_cost_byte + 1
            connections["Port"].append(line[first_port_byte:first_port_byte + 5])
            connections["doBind"].append(True)
          else:
            # Do Connect
            connections["IP"].append(line[0:7])
            last_cost_byte = self.find_last_cost_byte(line,16)
            connections["Cost"].append(line[16:last_cost_byte])
            first_port_byte = last_cost_byte + 1
            connections["Port"].append(line[first_port_byte:first_port_byte + 5])
            connections["doBind"].append(False)
    file.close()

    return connections
  
  def find_last_cost_byte(self, line, first_cost_byte):
    lcb_found = False # last cost byte found
    while (lcb_found == False):
      if(line[first_cost_byte] == ","):
        lcb = first_cost_byte # last cost byte
        lcb_found = True
      first_cost_byte += 1
    return lcb

  def run(self):
    # Bind and ports information for every connection
    do_Bind = list(self.connections.values())[2]
    ports = list(self.connections.values())[3]
    port_threads = []

    try:
      switch_thread = threading.Thread(
        target=self.redirect_packages # index is thread_num
      )
      switch_thread.start()
      # Create a thread for every port's connection
      for index in range(len(ports)): 
        port_thread = threading.Thread(
          target=self.router_init, args=(do_Bind[index], ports[index])
        )
        port_threads.append(port_thread)
        port_thread.start()
      # Join of threads
      for index in range(len(do_Bind)):
        threading.Thread.join(port_threads[index])
    
    except KeyboardInterrupt:
      print("Keyboard Interrupt")
      shutdown_router = "shutdown"
      self.switch_queue.put(shutdown_router)
      for queue in range(len(self.output_queues)): 
        self.output_queues[queue].put(shutdown_router)
  
  # Initialize router: Do binds and connects
  def router_init(self, do_Bind, port):
    #print("I'm router_init function")
    new_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    if(do_Bind == True):
      try:
        print(f"Server listen for connections in {port}")
        new_socket.bind(("localhost", int(port)))
        self.sockets.append(new_socket)
        # Establish connection
        new_socket.listen()
        #self.lock.acquire()
        client_socket, client_addr = new_socket.accept()
        #self.lock.release()
        print(f"Accepted connection from {client_addr}")
        #self.handle_connection(client_socket, client_addr)
      except OSError:
        print(f"error binding in {port}")
    else:
      connection_established = False
      while connection_established == False:
        try:
          time.sleep(2)
          new_socket.connect(("localhost", int(port)))
          print(f"Connected to {port}")
          connection_established = True
        except socket.error:
          print(f"Retrying to connect to {port}")
          None
      self.sockets.append(new_socket)

  def handle_connection(self, client_socket, client_address, thread_num):
    while True:
      try:
        client_socket.settimeout(3.0)
        recv_data = client_socket.recv(PACKAGE_MAX_CAPACITY)
        client_socket.settimeout(None)
        package = recv_data.decode("utf-8")
        print(package)
        # If package is received, then put package into input queue
        self.switch_queue.put(package)
        # print(f"thread_num: {thread_num}")
      except socket.timeout:
        #print("TIMEOUT")
        # Response package if output queue is not empty
        if (not self.output_queues[thread_num].empty()):
          response_package = self.output_queues[thread_num].get()
          print("handle_connection")
          print(response_package)
          if (not response_package == "shutdown"):
            client_socket.sendall(response_package.encode("utf-8"))
          else:
            disconnect_package = self.build_disconnect_package()
            client_socket.sendall(disconnect_package.encode("utf-8"))
            break
    #self.sockets[thread_num].close()
    client_socket.close()
    print(f"thread terminated{thread_num}")

  def redirect_packages(self):
    # wait for package (producer-consumer)
    while True:
      package = self.switch_queue.get()    
      if (not package == "shutdown"):
        # send to distance-vector algorithm
        d_package = self.descompose_message(package)
        self.print_package(d_package) # TODO delete

        if (d_package["ID"] == "0"):
          print("Routing package")
          routing_package = self.distance_vector_algorithm(d_package)
          if (routing_package):
            print("Table updated: send routing package to all neighbors")
        elif (d_package["ID"] == "1"):  # Normal Package
          # If this router is not the destiny, then redirect package to output
          if (not self.its_me_destiny(d_package["DestinyIP"])):
            # Change CurrentJumps and LastIP
            redirect_package = self.modify_redirect_package_header(package)

            print("Redirect Package")
            print(redirect_package)
            # Send Destiny IP (int) to get route to destiny
            redirect_IP = self.memory.getRoutingNeighborFor(self.translate_string_IP_to_int(d_package["DestinyIP"], "."))
            redirect_IP = redirect_IP[0:2] + " " + redirect_IP[2:4] + " " + redirect_IP[4:5]
            # Find output queue
            num_connection = self.connections["IP"].index(redirect_IP)
            # Redirect package to output queue
            self.output_queues[num_connection].put(redirect_package)
        elif (d_package["ID"] == "2"):
          print("Disconnect router package")
          print(package)
          self.disconnect_router(package)
          # Receives disconnection package
      else:
        #print(package)
        break

  def modify_redirect_package_header(self, redirect_package):
    packageList = list(redirect_package)
    # Change current jumps
    currentJumps = int(redirect_package[3:5]) + 1
    currentJumpsStr = str(currentJumps)
    if (len(currentJumpsStr) < 2):
      currentJumpsStr = "0"+currentJumpsStr
    currentJumps = list(currentJumpsStr)
    packageList[3] = currentJumps[0]
    packageList[4] = currentJumps[1]
    # Change Last IP
    lastIP = "".join(self.IP_Address.split("."))
    for index in range(5):
      # [10] is the index for last IP in header
      packageList[index + 10] = lastIP[index]
    redirect_package = "".join(packageList)
    return redirect_package

  def disconnect_router(self, disconnect_package):
    #self.print_routing_table()
    disconnect_ip = disconnect_package[5:10]
    print(disconnect_ip)
    if disconnect_ip[0] == "0":
      disconnect_ip = disconnect_ip[1:]
    disconnect_ip = int(disconnect_ip)
    cost = "In"
    route = "_____"
    self.memory.setRoutingWeightFor(disconnect_ip,cost)
    self.memory.setRoutingNeighborFor(disconnect_ip, route)
    #self.print_routing_table()

  def create_routing_table(self):
    my_router.analize_config_file_neighbors()
    neighbors, path = my_router.dijkstra(my_router.my_graph, my_router.IP_Address.replace(".", " "))
    neighbors.pop(self.IP_Address.replace(".", " "))
    print("\nRouting Table for REDES:")
    print(neighbors.items())
    print(path)
    current_counter = 0
    for items in neighbors.keys():
      address = int(re.sub("\ ", "", items))
      self.memory.setRoutingNeighborFor(address, str(path[items][0]).replace(" ", ""))
      if neighbors[items] < 10:
        my_weight = "0" + str(neighbors[items])
      else:
        my_weight = str(neighbors[items])
      self.memory.setRoutingWeightFor(address, my_weight)
      self.memory.setRoutingPortFor(address, str(self.routing_tables_ports[current_counter]))
      self.memory.setRoutingPhysicalIpFor(address, "127000000001")
      current_counter += 1
    print("\nRouting Table for OPER (Memory System):")
    self.print_routing_table()

  def print_routing_table(self):
    my_table = str()
    my_table += "RAM:\n"
    for i in range(0, 8):
      my_table += self.memory.safeRamGetPage(i).decode("utf-8") + "\n"

    my_table += "\nDisk:\n"
    for i in range(0, 20):
      my_table += self.memory.safeHardDiskGetPage(i).decode("utf-8") + "\n"

    print(my_table)

  #Implementing Dijkstra's Algorithm. Codigo adaptado de https://pythonwife.com/dijkstras-algorithm-in-python/. 
  def dijkstra(self, graph, initial):
    visited = {initial : 0}
    path = defaultdict(list)

    nodes = set(graph.nodes)

    while nodes:
      minNode = None
      for node in nodes:
        if node in visited:
          if minNode is None:
            minNode = node
          elif visited[node] < visited[minNode]:
            minNode = node
      if minNode is None:
        break

      nodes.remove(minNode)
      currentWeight = visited[minNode]

      for edge in graph.edges[minNode]:
        weight = currentWeight + graph.distances[(minNode, edge)]
        if edge not in visited or weight < visited[edge]:
          visited[edge] = weight
          path[edge].append(minNode)
    
    return visited, path
  
  # Prints the package info
  def print_package(self, package):
    print("Receive package info...")
    print("ID:", package['ID'])
    print("Maximum jumps allowed:", package['MaxJumps'])
    print("Total of jumps made:", package['CurrentJumps'])
    print("From IP Address:", package['OrigenIP'])
    print("Last visited router:", package['LastVistedRouter'])
    print("To IP Address:", package['DestinyIP'])

  def decompose_message(self, msg):
    # This was the specified format for the message.
    # Means IP Addresses are like 16.30.8
    if "." in msg:
      message_dictionary = {
        "ID":msg[:1],
        "MaxJumps":msg[1:3],
        "CurrentJumps":msg[3:5],
        "OrigenIP":msg[5:12],
        "LastVistedRouter":msg[12:19],
        "DestinyIP":msg[19:26]
      }
    # Means IP Addresses are like 16308
    else:
      message_dictionary = {
        "ID":msg[:1],
        "MaxJumps":msg[1:3],
        "CurrentJumps":msg[3:5],
        "OrigenIP":msg[5:7] + "." + msg[7:9] + "." + msg[9:10],
        "LastVistedRouter":msg[10:12] + "." + msg[12:14] + "." + msg[14:15],
        "DestinyIP":msg[15:17] + "." + msg[17:19] + "." + msg[19:20],
      }

    return message_dictionary

  def analize_message(self, msg_dictionary):
    # This method follows algorithmn in Original Desing from Etapa 02.

    # Receives the IP Address with '.'.
    msg_IP_info = msg_dictionary['DestinyIP'].split('.')
    my_IP_info = self.IP_Address.split(',')
    
    # Checks if province is the same.
    if my_IP_info[0] == msg_IP_info[0]:
      # Checks if canton is to the same one.
      if my_IP_info[1] == msg_IP_info[1]:
        # Send package to health area msg_IP_info[2].
        print("Province and Canton are the same, send to specified health area.")
      else:
        # Check if I have connection with that node:
          # If Yes: send package to that other router msg_IP_info[1].
          print("I've connection with that router, I'll send it.")
          # If Not: check routing table to find where to send it.
          print("I don't have a connection with that router, must check routing table.")
    # Different province.
    else:
      # Check if this cantonal router is a border router.
      print("Province is different.")
        # If Yes: send it to that server.
          #print("I'm the border router, I'll send it to the province.")
        # If Not: check routing table to find border router and send it throught there.
          #print("I'm not the border router, must check routing table to send it there.")

  def build_disconnect_package(self):
    ip = "".join(self.logic_IP.split("."))
    disconnect_package = "20800" + ip + ip + "00000" + "Disconnect router"
    return disconnect_package

  def translateIntIpToStr(self, ip):
    strIp = ""
    if math.floor(ip / 10000) == 0:
      strIp = "0"
    strIp += str(ip)
    return strIp

  def translate_string_IP_to_int(self, ip, split_val):
    list_IP = ip.split(split_val)
    int_IP = "".join(list_IP)
    int_IP = int(int_IP)
    return int_IP

  def its_me_destiny(self, destinyIP):
    return self.logic_IP == destinyIP

  def analize_config_file_neighbors(self):
    # Find data about his near routers and connections.
    with open(config_file_name, mode ='r') as file:
      my_reader = csv.reader(file)
      for line in my_reader:
        if len(line) < 4:
          if line[0][0:2] == self.province and line[0][6] == "0":
            #print(line[0])
            self.my_graph.addNode(line[0])
        if len(line) == 4:
          if line[0][0:2] == self.province and line[1][3:5] != "00" and line[0][6] == "0" and line[1][6] == "0":
            #print(line)
            self.my_graph.addEdge(line[0], line[1], int(line[2]))
            self.my_graph.addEdge(line[1], line[0], int(line[2]))
            self.routing_tables_ports.append(line[3])
          
  def print_router_info(self):
    print("Router Information:")
    print("My IP Address:", self.IP_Address)
    #self.print_routing_table()

if __name__ == "__main__":
  my_node = None
  my_subnode = None
  if len(sys.argv) < 3 or len(sys.argv) > 3:
    my_node = input('Enter the node (province) for this router: ')
    my_subnode = input('Enter the subnode (canton) for this router: ')
  else:
    my_node = sys.argv[1]
    my_subnode = sys.argv[2]

  my_router = Intra_provincial_router(my_node, my_subnode)
  my_router.print_router_info()
  my_router.create_routing_table()
  my_router.run()

  