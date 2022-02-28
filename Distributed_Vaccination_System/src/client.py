# Authors: Emmanuel D. Solis, Javier Molina Herrera, Carlos Valle,Gilbert Marquez.
import socket
import csv
import re
import sys

AUTHENTICATION_SERVER_ADDRESS = ("localhost", 3000)
lOCAL_SERVER_ADDRESS = ("localhost", int(sys.argv[1]))
PACKAGE_MAX_CAPACITY = 1024
VACCINATED_PEOPLE_ROUTE = "../data/"


def access_to_server(my_client):
    access_to_server = 1
    while access_to_server != 0:
        # 1. Ask for credentials.
        data = my_client.ask_for_credentials()
        # 2. Send credentials to authentication server.
        access_to_server = my_client.send_authentication_data_to_server(
            data[0], data[1]
        )
        # 3 If credentials not correct give chance to exit or enter new credentials.
        if access_to_server == 3:
            print("The credentials server is offline, try again later")
            exit(0)
    return data


def send_info_menu(my_client, sessionInfo):
    opcion = 0
    while opcion != "2":
        print(f"{sessionInfo[0]} session:\n1) Send packages\n2) Logout")
        opcion = input("choose an option: ")
        if opcion == "1":
            isLoaded = False
            while isLoaded == False:
                try:
                    nombreArchivo = input("Enter the file name to load: ")
                    isLoaded = my_client.load_file(nombreArchivo)
                except OSError:
                    print("Could not find the file, enter a valid name!!")

            my_client.connect_to_server((my_client.create_packages()))
        elif opcion == "2":
            print(f"{sessionInfo[0]} session closed\n")
        else:
            print("\n!!Invalid option!!\n")


def main():
    my_client = Client()  # Instance of my client.
    opcion = 0
    while opcion != "2":
        print("Main menu:\n1) Login\n2) Exit")
        opcion = input("Choose an option: ")
        if opcion == "1":
            sessionInfo = access_to_server(my_client)
            send_info_menu(my_client, sessionInfo)
            # 4. Ask for file with data name or path.
        elif opcion == "2":
            print("Client closed.")
        else:
            print("\n!!Invalid option!!\n")


class Client:
    people_vaccinated = list()  # List to store the loaded information from de csv
    packages = {}  # diccionary to store the packges to be send

    def __init__(self) -> None:
        pass

    # Kinds of error codes:
    # 0. Login successfully.
    # 1. Username does not exits.
    # 2. Incorrect password.
    # 3. Server is not online.
    def send_authentication_data_to_server(self, username, password):
        # Create client socket
        my_socket = socket.socket(
            socket.AF_INET, socket.SOCK_STREAM
        )  # AF_INIT stands for IPv4, SOCK_STREAM for TCP Socket.
        try:
            # Connect the socket
            my_socket.connect(AUTHENTICATION_SERVER_ADDRESS)
            data = username + "$$$" + password
            my_socket.sendall(data.encode("utf-8"))

            # Handle response from server.
            data = my_socket.recv(
                1
            )  # Server responses 2 on non-true credentials or 0 on Login success.
            answer = int(data.decode("utf-8"))
            if answer == 0:
                print("Login succesfully\n")
                return 0
            elif answer == 1:
                print("Username does not exist.")
                return 1
            elif answer == 2:
                print("Incorrect password")
                return 2
        except KeyboardInterrupt:
            quit()
        except OSError:
            # server offline
            return 3

    # asks the user for the login credentials
    def ask_for_credentials(self):
        try:
            print("Enter your username:")
            data = []
            data.append(input())
            print("Enter your password:")
            data.append(input())
        except KeyboardInterrupt:
            print("\nClient closed.")
            quit()

        return data

    # Function to read cvs data from vaccinated people.
    def load_file(self, fileName):
        with open(VACCINATED_PEOPLE_ROUTE + fileName, mode="r") as file:
            # reading the CSV file
            csvFile = csv.reader(file)

            # loads the contents of the CSV file
            for lines in csvFile:
                self.people_vaccinated.append(lines)
            print("Data from", VACCINATED_PEOPLE_ROUTE + fileName, "loaded succesfully")
            return True

    # Function to create packages to send.
    def create_packages(self):
        package_counter = 0
        residual_string = ""
        data = f"{package_counter:04d}"
        for iterator in range(len(self.people_vaccinated)):
            data += self.people_vaccinated[iterator][0] + ","  # ID
            data += self.people_vaccinated[iterator][1] + ","  # Name
            data += self.people_vaccinated[iterator][2] + ","  # Province
            data += self.people_vaccinated[iterator][3] + ","  # District
            data += self.people_vaccinated[iterator][4] + "\n"  # Health Area
        # if the package is to big, it has to be divided
        while len(data) > PACKAGE_MAX_CAPACITY:
            residual_string = data[PACKAGE_MAX_CAPACITY : len(data)]
            data = data[0:PACKAGE_MAX_CAPACITY]
            self.packages[package_counter] = data
            package_counter += 1
            data = f"{package_counter:04d}" + residual_string
        final_package_lenth = len(data)
        if final_package_lenth < PACKAGE_MAX_CAPACITY:
            # By convention, fill with dollar symb.
            data += "$" * (PACKAGE_MAX_CAPACITY - final_package_lenth)
        self.packages[package_counter] = data  # This is the final package to be send.
        package_counter += 1
        return package_counter
        # print(self.packages)

    # connects to the server to send the loaded information
    def connect_to_server(self, number_of_packages):
        # Creates the socket to connect with the host server.
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        client_socket.settimeout(5)
        confirm_connection = "@@" + f"{number_of_packages}" + "@@"
        confirm_connection += "$" * (PACKAGE_MAX_CAPACITY - len(confirm_connection))
        # sends the firt message to the server
        client_socket.sendto(confirm_connection.encode("utf-8"), lOCAL_SERVER_ADDRESS)
        # receives from the server the new port to connect
        try:
            new_port = client_socket.recv(PACKAGE_MAX_CAPACITY)
            if new_port:
                new_port = new_port.decode("utf-8")
                # removes garbage from the package
                new_port = re.sub("\$", "", new_port)
                # creates the new adress to connect to the server
                new_address = (lOCAL_SERVER_ADDRESS[0], int(new_port))
                # Sends all the packages to the server
                for i in range(0, number_of_packages):
                    package = self.packages.get(i)
                    package = str(package).encode("utf-8")
                    client_socket.sendto(package, new_address)
                    # wait until thre's no packages to resend
                while True:
                    package_request = client_socket.recv(PACKAGE_MAX_CAPACITY)
                    package_request = package_request.decode("utf-8")
                    # if the server already sends the finish connection package
                    if "n" not in package_request:
                        # removes garbage from the package
                        requested_package = re.sub("\&", "", package_request)
                        requested_package = int(re.sub("\$", "", requested_package))
                        client_socket.sendto(
                            str(self.packages.get(requested_package)).encode("utf-8"),
                            new_address,
                        )
                    else:
                        break
                print(f"packages sended to server: {number_of_packages}")
        except:  # if the server don't send any package in 5 seconds the connection is interrupted
            print("!!Connection with the server lost,  please try again!!")
        client_socket.close()


# Initializing the code.
if __name__ == "__main__":
    main()
