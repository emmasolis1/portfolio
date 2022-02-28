from queue import Queue
import math
import re
from signal import signal, SIGPIPE, SIG_DFL
signal(SIGPIPE,SIG_DFL)
import socket
import sys
import threading
import time
import MMU
import re

PACKAGE_MAX_CAPACITY = 1024

class Inter_provincial_router:
  def __init__(self):
    # Build Logic IP
    self.logic_IP = self.build_Logic_IP()
    print(f"Logical IP: {self.logic_IP}")
    logicIntIp =  int(re.sub("\.", "", self.logic_IP))
    self.memory = MMU.MMU(logicIntIp)
    # Initialize queues and ports
    self.connections = self.read_from_conf_file() #connections = {"IP":[],"Cost":[],"doBind":[],"Port":[]}
    print(self.connections)
    self.sockets = []
    # Queue for messages received (input queue)
    self.switch_queue = Queue()
    self.output_queues = []
    for index in range(len(self.connections["IP"])):
      self.output_queues.append(Queue())
    # routing_table

    # each pair of input/output queues share a socket, so a router can't send an receive paralelly in a pair of queues 
    print("I'm init function")

  def run(self):
    # Bind and ports information for every connection
    do_Bind = self.connections["doBind"]
    ports = self.connections["Port"]
    port_threads = []

    # Initialize routing tables
    self.initialize_routing_table()
    #self.build_distance_vector_package() ########################################################
    # Create thread for switch
    try:
      switch_thread = threading.Thread(
        target=self.redirect_packages # index is thread_num
      )
      switch_thread.start()
      # Create a thread for every port's connection
      for thread_num in range(len(ports)): 
        port_thread = threading.Thread(
          target=self.router_init, args=(do_Bind[thread_num], ports[thread_num], thread_num) # index is thread_num
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
  def router_init(self, do_Bind, port, thread_num):
    print("I'm router_init function")
    new_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    if(do_Bind == True):
      try:
        print(f"Server listen for connections in {port}")
        new_socket.bind(("localhost", int(port)))
        self.sockets.append(new_socket)
        # Establish connection
        new_socket.listen()
        client_socket, client_addr = new_socket.accept()
        print(f"Accepted connection from {client_addr}")
        self.handle_connection(client_socket, client_addr, thread_num)
      except OSError:
        print(f"error binding in {port}")
    else:
      connection_established = False
      while connection_established == False:
        try:
          time.sleep(2)
          new_socket.connect(("localhost", int(port)))
          print(f"Connect to {port}")
          connection_established = True
        except socket.error:
          print(f"Retrying to connect to {port}")
      self.sockets.append(new_socket)

  # Data Plane

  def build_Logic_IP(self):
    if(int(sys.argv[1]) > 9):
      logic_IP = sys.argv[1] + ".00.0"
    else:
      logic_IP = "0"+ sys.argv[1] + ".00.0"
    return logic_IP

  # Reads it's ports and connections from the config file
  # Returns a dictionary with the following information for each connection
  # |Logic IP|Cost|Port|doBind?|
  def read_from_conf_file(self):
    # My logical IP to find my info in the file
    logical_IP = self.logic_IP.replace("."," ")

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

  # Control Plane
  def descompose_message(self, msg):
    d_message = {"ID":msg[:1], "MaxJumps":msg[1:3],"CurrentJumps":msg[3:5], 
      "OriginIP":msg[5:7]+"."+msg[7:9] +"."+msg[9:10],
      "LastIP":msg[10:12]+"."+msg[12:14]+"."+msg[14:15],
      "DestinyIP":msg[15:17]+"."+msg[17:19]+"."+msg[19:20]}
    return d_message

  def handle_connection(self, client_socket, client_address, thread_num):
    #print("I'm handle connection...")
    # receive msg with timeout
    # Check if output queue is empty
    # If it's not empty --> send package
    while True:
      try:
        client_socket.settimeout(3.0)
        recv_data = client_socket.recv(PACKAGE_MAX_CAPACITY)
        client_socket.settimeout(None)
        package = recv_data.decode("utf-8")
        # If package is received, then put package into input queue
        self.switch_queue.put(package)
        # print(f"thread_num: {thread_num}")
      except socket.timeout:
        #print("TIMEOUT")
        # Response package if output queue is not empty
        if (not self.output_queues[thread_num].empty()):
          response_package = self.output_queues[thread_num].get()
          #print("handle_connection")
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
        #self.print_package(d_package) # TODO delete

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

  def get_neighbor_index(self, ip):
    neighbor_index = 0
    try:
      neighbor_index = self.connections["IP"].index(ip)      
    except ValueError:
      neighbor_index = -1

    return neighbor_index

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
    lastIP = "".join(self.logic_IP.split("."))
    for index in range(5):
      # [10] is the index for last IP in header
      packageList[index + 10] = lastIP[index]
    redirect_package = "".join(packageList)
    return redirect_package

  # Initializes routing table with neighbor's costs and cost to myself (for distance-vector)
  def initialize_routing_table(self):
    # Initialize cost and routes for neighbors
    for index in range(self.memory.getRoutingInfoDiskSlots()):
      ip = self.memory.translateDiskAddrToIp(index)
      str_IP = self.translateIntIpToStr(ip)
      str_IP = str_IP[0:2] + " " + str_IP[2:4] + " " + str_IP[4:5]
      print(ip)
      neighbor_index = self.get_neighbor_index(str_IP)
      if (neighbor_index >= 0):
        # is neighbor
        n_cost = self.connections["Cost"][neighbor_index]
        if(len(n_cost) == 1):
          n_cost = "0" + n_cost
        n_route = "".join(str_IP.split(" "))
        print(f"str_IP: {str_IP} , cost: {n_cost} , route: {n_route}")
        self.memory.setRoutingWeightFor(ip,n_cost)
        self.memory.setRoutingNeighborFor(ip, n_route) # ruta
      else:
        # is not neighbor
        infinity = "In"
        n_route = "_____"
        print(f"IP: {str_IP} , cost: {infinity} , route: {n_route}")
        self.memory.setRoutingWeightFor(ip,infinity)

  # Updates table
  def distance_vector_algorithm(self,routing_package):
    new_routing_package = ""
    table_updated = False
    my_IP = int(self.translate_string_IP_to_int(self.logic_IP,"."))
    my_cost_to_neighbor = ""
    other_IP = ""
    other_cost_to_neighbor = ""
    
    # Compare every table entry with my entry
    for index in range(self.memory.getRoutingInfoDiskSlots()):
      print("a")

    # if table was updated, then build package to be sent to neighbors
    if (table_updated):
      new_routing_package = build_distance_vector_package()

    return new_routing_package

  def build_distance_vector_package(self):
    routing_package = ""
    # Build header
    my_IP = "".join(self.logic_IP.split("."))
    header = {"ID":"0", "MaxJumps":"1","CurrentJumps":"0", 
      "OriginIP":my_IP,
      "LastIP":my_IP,
      "DestinyIP":"00000"}
    # Build content
    n_IP = None
    n_route = ""
    n_cost = ""
    route_table_message = ""
    for index in range(self.memory.getRoutingInfoDiskSlots()):
      n_IP = self.memory.translateDiskAddrToIp(index)
      n_IP_str = self.translateIntIpToStr(n_IP)
      n_route = self.memory.getRoutingNeighborFor(n_IP)
      n_cost = self.memory.getRoutingWeightFor(n_IP)
      
      route_table_message += n_IP_str + n_route + n_cost
    
    routing_package = "".join(header.values()) + route_table_message
    print("routing package")
    print(routing_package)
    return routing_package

  def build_disconnect_package(self):
    ip = "".join(self.logic_IP.split("."))
    disconnect_package = "20800" + ip + ip + "00000" + "Disconnect router"
    return disconnect_package

  def update_routing_table(self):
    print("I'm update routing table function")

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

  # Prints the package info
  def print_package(self, package_info):
    print("Package information")
    for key,value in package_info.items():
      print(key, ' : ',value)

  # Prints the routing table to see status
  def print_routing_table(self):
    my_table = str()
    my_table += "RAM:\n"
    for i in range(0, 8):
      my_table += self.memory.safeRamGetPage(i).decode("utf-8") + "\n"

    my_table += "\nDisk:\n"
    for i in range(0, 20):
      my_table += self.memory.safeHardDiskGetPage(i).decode("utf-8") + "\n"

    print(my_table)

inter_provincial_router = Inter_provincial_router()
inter_provincial_router.run()