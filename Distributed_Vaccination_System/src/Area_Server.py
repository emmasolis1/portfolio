import csv
from os import error
import socket
import sys
import threading
import re
import time
from typing import Iterator
from queue import Queue
 

PACKAGE_MAX_CAPACITY = 1024
SERVER_ADDR = ("localhost", int(sys.argv[4]))


class Server:
    def __init__(self, province, canton, area):
        if int(province) < 10:
            province = "0" + province
        if int(canton) < 10:
            canton = "0" + canton
        self.my_logical_addr = province + " " + canton + " " + area
        self.config_file_name = "./red_conf.csv"
        self.canton_port = int(0)
        self.portQueue = Queue()
        self.messageQueue = Queue()
        self.server_socket = socket.socket(
            socket.AF_INET, socket.SOCK_DGRAM
        )  # Parametro DGRAM utiliza protocolo UDP
        self.router_socket = socket.socket(
            socket.AF_INET, socket.SOCK_STREAM
        )
        for i in range(7000, 8000) :
            self.portQueue.put(i)
        

    def handle_router_connection(self):
        #while True:
        #time.sleep(30)
        #if self.messageQueue.empty() == False:
        #self.messageQueue.put("Testing...please work.")
        #self.router_socket.sendall(self.messageQueue.get().encode('UTF-8'))
        #self.router_socket.sendall("Please please work...".encode('UTF-8'))
        None

    # handles the client request
    def handle_client(self, data_recv, client_addr):
        package_counter = 0
        packages = {}
        thread_lock = threading.Lock()
        total_packages = data_recv.decode("utf-8")
        if "@@" in total_packages:
            print(F"Server accept the client: {client_addr}")
            with thread_lock:
                myPort = self.portQueue.get() 
                server_response = myPort
            new_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            new_Addr = (SERVER_ADDR[0], server_response)
            new_socket.bind(new_Addr)
            server_response = str(server_response)
            server_response += "$" * (PACKAGE_MAX_CAPACITY - len(server_response))
            self.server_socket.sendto(str(server_response).encode("utf-8"), client_addr)
            total_packages = int(self.clean_string(total_packages))
            new_socket.settimeout(1.5)
            while True:
                if package_counter == total_packages:
                    stop_sending = "&n&"
                    stop_sending += "$" * (PACKAGE_MAX_CAPACITY - len(stop_sending))
                    new_socket.sendto(stop_sending.encode(), client_addr)
                    new_socket.close()
                    break
                try:
                    recived_package, client_addr = new_socket.recvfrom(
                        PACKAGE_MAX_CAPACITY
                    )
                    recived_package = recived_package.decode("utf-8")
                    clean_package = self.clean_string(recived_package)
                    index = int(clean_package[0:4])
                    # print(index)
                    packages[index] = clean_package[4:PACKAGE_MAX_CAPACITY]
                    package_counter += 1
                except:
                    self.ask_for_missing_packages(
                        total_packages, packages, client_addr, new_socket
                    )
            complete_package = self.link_recieved_packages(packages, total_packages)
            #print(complete_package)
            print(F"Server close the client: {client_addr}")
            self.process_and_enqueue(complete_package)
            self.portQueue.put(myPort)
            # procesar paquetes, enviar al router linea por linea con 
            # su respectiva información de enrutamiento
    
    def process_and_enqueue(self, string_package):
        list_of_lines = str(string_package).splitlines()
        for i in range(len(list_of_lines)):
            line = list_of_lines[i]
            router_package = self.create_router_package(line)
            print(router_package)
            self.messageQueue.put(router_package)
            
    def analize_config_file(self):
        search_ip = self.my_logical_addr
        # Find data about his near routers and connections.
        with open(self.config_file_name, mode ='r') as file:
            my_reader = csv.reader(file)
            for line in my_reader:
                if len(line) == 4:
                    if line[1] == search_ip:
                        self.canton_port = int(line[3])
                        break

    def create_router_package(self, line):
        #[0]cedula [1]nombre [2]provincia [3]canton [4]area de salud
        package_info = str(line).split(",")
        province = package_info[2]
        canton = package_info[3]
        #[0]provincia [1]canton [2]area de salud
        origin_ip = self.my_logical_addr.split(" ")
        # ID, Maximos saltos, saltos actuales, IP de origen, IP de ultimo router
        router_package = "11600" + origin_ip[0] + origin_ip[1] + origin_ip[2] + "00000"
        if int(province) < 10:
            province = "0" + province
        if int(canton) < 10:
            canton = "0" + canton
        # IP destino
        router_package += province + canton + package_info[4]
        # Mensaje
        router_package += package_info[1] + "," + package_info[0]
        return router_package   

    # Eliminates the garbage from a package
    def clean_string(self, string_to_clean):
        string_to_clean = re.sub("\@", "", string_to_clean)
        cleaned_string = re.sub("\$", "", string_to_clean)
        return cleaned_string

    # asks for the server to send the missing packages
    def ask_for_missing_packages(
        self, total_packages, packages, client_addr, new_socket
    ):
        for i in range(0, total_packages):
            if packages.get(i) == None:
                missing_package = "&&" + str(i) + "&&"
                missing_package += "$" * (PACKAGE_MAX_CAPACITY - len(missing_package))
                new_socket.sendto(missing_package.encode("utf-8"), client_addr)

    # prints the message recieved
    def link_recieved_packages(self, packages, total_packages):
        final_message = ""
        for i in range(0, total_packages):
            final_message += packages.get(i)
        return final_message

    # accepts clientes and assing a thread to handle it
    def serve_forever(self, server_socket):
        try:
            router_connection_handler = threading.Thread(
                target=self.handle_router_connection()
            )
            router_connection_handler.daemon = True
            router_connection_handler.start()
            while True:
                data_recv, client_addr = server_socket.recvfrom(PACKAGE_MAX_CAPACITY)
                client_requrest = threading.Thread(
                    target=self.handle_client, args=(data_recv, client_addr)
                )
                client_requrest.daemon = True
                client_requrest.start()

        except KeyboardInterrupt:
            print("Server close")
            server_socket.close()

    def connect_to_router(self):
        self.analize_config_file()
        time.sleep(1)
        try:
            self.router_socket.connect(("localhost", self.canton_port))
        except socket.error:
            self.router_socket.connect(("localhost", self.canton_port))
        print("Connection established with cantonal router on port", self.canton_port)


def main():
    my_server = Server(sys.argv[1], sys.argv[2], sys.argv[3])
    my_server.server_socket.bind(SERVER_ADDR)
    print(f"Server listen for connections in {SERVER_ADDR}")
    #my_server.connect_to_router()
    my_server.serve_forever(my_server.server_socket)


if __name__ == "__main__":
    main()
