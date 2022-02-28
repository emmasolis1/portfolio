#ifndef UDPSERVER_H
#define UDPSERVER_H

#include <map>
#include <mutex>
#include <stack>
#include <string>
#include <thread>
#include <vector>
#include <semaphore.h>
#include "my_pipe.h"
#include "UDPSocket.hpp"

#define BUFFER_SIZE 1024
#define FIRST_PORT 49153
#define LAST_PORT 65534

class UDPServer {
private:
  // Socket to listen for connection requests
  UDPSocket connectionRequestSocket;
  // Host address
  std::string hostAddress;
  // Threads created to each client
  std::vector<std::thread*> clientsThreads;
  // Stack of available ports (range from 49153 to 65534)
  std::stack<unsigned short> availablePorts;
  // Mutex to access ports
  std::mutex canAccessPorts;
  // Mutex to access pipe
  std::mutex canAccessPipe;
  // Semaphores to write and read on/from pipe
  sem_t* canWritePipe;
  sem_t* canReadPipe;
  // Printing pipe
  char* impresionPipe;

public:
  UDPServer(std::string inetAddr, int port, sem_t* writeSemaphore, sem_t* readSemaphore, char* pipe);
  ~UDPServer();

  int startReceiving();
  void stopServer();

  void setWriteSemaphore(sem_t* writeSemaphore);
  void setReadSemaphore(sem_t* readSemaphore);
  void setPipe(char* pipe);
private:
  /**
   * @brief receives and stores all packages sent by client.
   * @details receives and stores (in a map) all packages sent by client,
   * if there was any failure when receiving one or some packages, asks for 
   * the packages one by one.
   * @param clientAddress client socket's address.
   * @param port port to establish connection.
   * @param noOfPackages number of packages to receive.
   * @return returns 0 on success and -1 on error.
  */
  int handleConnection(SocketAddress clientAddress,int port, int noOfPackages);
  
  /**
   * @brief redirects the client connection to a different port.
   * @details sends to client a different port to establish a new connection.
   * @param port port to establish a new connection.
   * @param clientAddress client socket's address.
   * @return returns 0 on success and -1 on error.
  */
  int redirectToPort(int port, SocketAddress clientAddress);
  
  /**
   * @brief returns the number of packages to be received.
   * @details extracts the number of packages from the buffer message.
   * @param buffer buffer that contains a message.
   * @param size size of buffer.
   * @return the amount of sums in the array.
  */
  int readNoOfPackages(std::string &buffer, int size);

  /**
   * @brief stores package in a map.
   * @details separates message sent by client in key/number of package
   * (first 4 bits) and vaccination information.
   * @param receivedPackages map to store all packages.
   * @param buffer message sent by client.
   * @return returns 0 on success and -1 on error.
  */
  int storePackage(std::map<int, std::string> &receivedPackages, char* buffer);

  /**
   * @brief appends trash($) to a client's/server's message until is
   * 1024 bytes long.
   * @details appends trash($) to a client's/server's message until is
   * 1024 bytes long.
   * @param buffer string to be "extended" with "$".
  */
  void fillWithDollarSigns(std::string& buffer);

  /**
   * @brief stores package in a map.
   * @details separates message sent by client in key/number of package
   * (first 4 bits) and vaccination information.
   * @param receivedPackages map to store all packages.
   * @param buffer message sent by client.
   * @return returns 0 on success and -1 on error.
  */
  void askForMissingPackages(int totalPackages,
   std::map<int, std::string>& receivedPackages, UDPSocket& socket,
    SocketAddress clientAddress);
  
  /**
   * @brief This fucntion is made in order to syncronize the diferent threads writing on the pipe so that only can write.
   * @return int as an error status.
   */
  int writingOnPipe(std::map<int, std::string>& thread_private_map);
  
};
#endif  // UDPSERVER_H 