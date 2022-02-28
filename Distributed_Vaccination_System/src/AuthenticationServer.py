import socket
import threading

SERVER_ADDR = ("localhost", 3000)
DATABASE_NAME = "../data/credentials.csv"
PACKAGE_MAX_CAPACITY = 1024


def main():
    autentification_server = Autentification_Server(SERVER_ADDR)
    autentification_server.server_init()
    autentification_server.serve_forever()


class Autentification_Server:
    def __init__(self, server_addr):
        self.sever_addr = server_addr
        self.server_socket = None
        self.user_database = {}

    def server_init(self):
        try:
            with open(DATABASE_NAME) as readed_file:
                for line in readed_file:
                    # By convention credentials in file are separated by commas.
                    credentials = line.split(",")
                    # Asign the password to its specific username in a databases.
                    self.user_database[credentials[0]] = credentials[1]
            self.server_socket = socket.socket(
                socket.AF_INET, socket.SOCK_STREAM
            )  # Socket that receives the authentication request.
            print(f"Server listen for connections in {self.sever_addr}")
            self.server_socket.bind(
                (self.sever_addr[0], self.sever_addr[1])
            )  # Asigns my address to my own socket.
        except OSError as error:
            print("The server needs a csv file as a data base.")
            quit()

    def handle_connection(self, client_socket, client_address):
        try:
            recv_data = client_socket.recv(PACKAGE_MAX_CAPACITY)
            message = recv_data.decode("utf-8")
            # By convention the username and the password are in the same string, in the form name$$$password.
            credentials = message.split("$$$")
            username = credentials[0]
            password = credentials[1]
            password += "\n"
            response = self.check_registration(
                username, password
            )  # Function to corrobores if user and password are correct.
            if response == 1:
                print("Access denied: user not registered")
            elif response == 2:
                print("Access denied: incorrect password")
            else:
                print(f"User {username} accepted")
            client_socket.sendall(str(response).encode("utf-8"))
        finally:
            client_socket.close()  # Closes the connection as this server only checks for credentials.
            print(f"Closing connection with {client_address}")

    def serve_forever(self):
        try:
            self.server_socket.listen()
            while True:
                client_socket, client_addr = self.server_socket.accept()
                print(f"Accepted connection from {client_addr}")
                client = threading.Thread(
                    target=self.handle_connection, args=(client_socket, client_addr)
                )  # Multi thread server, each client served in a separated thread.
                client.start()  # Starts running the threads function.

        except KeyboardInterrupt:
            print("Server close")
            self.server_socket.close()

    def check_registration(self, username, password):
        if username in self.user_database:
            if self.user_database[username] == password:
                return 0  # Credentials are correct.
            else:
                return 2  # Incorrect password for entered username.
        else:
            return 1  # User does not exist.


if __name__ == "__main__":
    main()
