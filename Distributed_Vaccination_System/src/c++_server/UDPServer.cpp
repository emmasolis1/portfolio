// Copyright 2021 Emmanuel, Javier, Gilbert y Carlos <ucr.ac.cr>

#include <arpa/inet.h>
#include <netdb.h>  // Definitions for network database
#include <sys/socket.h>  // Define socket header strucutre
#include <sys/types.h>  // For diferent types needed
#include <semaphore.h>
#include <iostream>
#include "UDPServer.hpp"

/*
TODO: destroy threads that are attending clients with pthread_destroy.
*/

UDPServer::UDPServer(std::string inetAddr, int port, sem_t* writeSemaphore,
  sem_t* readSemaphore, char* pipe) {
  this->hostAddress = inetAddr;
  this->connectionRequestSocket.udpBind(inetAddr, port);
  this->canWritePipe = writeSemaphore;
  this->canReadPipe = readSemaphore;
  this->impresionPipe = pipe;
  for (unsigned short port = LAST_PORT; port > FIRST_PORT; port--) {
    this->availablePorts.push(port);
  }
}

int UDPServer::startReceiving() {
  int error = EXIT_SUCCESS;
  SocketAddress clientAddress;
  char buff[BUFFER_SIZE];

  std::cout << "Waiting for connections" << std::endl;
  while (true) {
    std::fill_n(&buff[0], BUFFER_SIZE, '\0');
    // Wait to receive a connection
    if (this->connectionRequestSocket.udpRecvfrom(BUFFER_SIZE, buff,
      clientAddress) == EXIT_SUCCESS) {
      std::string strnBuffer(buff, BUFFER_SIZE);
      // Read number of packages
      int noOfPackages = readNoOfPackages(strnBuffer, BUFFER_SIZE);
      std::cout << "Expecting to receive " << noOfPackages << " packages\n";

      // Close critical zone (to access ports stack)
      this->canAccessPorts.lock();
      if (!this->availablePorts.empty()) {
        int tempPort = (int) this->availablePorts.top();
        this->availablePorts.pop();
        // Open critical zone (to access ports stack)
        this->canAccessPorts.unlock();

        redirectToPort(tempPort, clientAddress);

        // Create thread to handle connections
        if (noOfPackages > -1) {
          std::thread* thread = new std::thread(&UDPServer::handleConnection,
            this, clientAddress, tempPort, noOfPackages);
          this->clientsThreads.push_back(thread);
        } else {
          std::cerr << "Number of packages failed" << std::endl;
        }
      } else {
        this->canAccessPorts.unlock();
        std::cerr << "Not available ports" << std::endl;
      }
    } else {
      std::cerr << "Error in recvfrom execution\n" << std::endl;
      error = EXIT_FAILURE;
      break;
    }
  }

  return error;
}

int UDPServer::handleConnection(SocketAddress clientAddress, int port,
  int noOfPackages) {
  int error = EXIT_SUCCESS;
  UDPSocket socket;
  socket.udpBind(this->hostAddress, port);
  socket.setRecvTimeOut(1, 0);
  std::map<int, std::string> receivedPackages;

  // 1. loop to receive packages
  // 2. Verify which packages weren't received
  // 3. Ask for left packages one by one

  int packagesCount = 0;
  char buff[BUFFER_SIZE];
  // Loop to receive packages
  while (packagesCount < noOfPackages) {
    try {
      // Wait to receive packages (until timeout is reached)
      socket.udpRecvfrom(BUFFER_SIZE, buff, clientAddress);
      storePackage(receivedPackages, buff);
      packagesCount++;
    } catch (const char* msg) {
      askForMissingPackages(noOfPackages, receivedPackages, socket,
       clientAddress);
    }
  }
  std::string allPackagesRcvd = "&n&";
  fillWithDollarSigns(allPackagesRcvd);
  socket.udpSendto(allPackagesRcvd, clientAddress);
  socket.udpClose();
  std::cout << "Socket connected to client with "
    << clientAddress.getStringAddress() << ", closed.\n";
  // Push port
  this->canAccessPorts.lock();
  this->availablePorts.push(port);
  this->canAccessPorts.unlock();
  this->writingOnPipe(receivedPackages);
  return error;
}

int UDPServer::redirectToPort(int port, SocketAddress clientAddress) {
  std::string portStr = std::to_string(port);
  fillWithDollarSigns(portStr);
  // Sends to client the port to make a new connection
  int error = this->connectionRequestSocket.udpSendto(portStr, clientAddress);
  return error;
}

int UDPServer::readNoOfPackages(std::string &buffer, int size) {
  int ret = -1;
  std::string numberOfPackages;

  // Extract number of packages from message given as follows:
  // @@n@@ , where n is the number of packages
  if (buffer[0] == '@' && buffer[1] == '@') {
    int index = 2;
    for (; index < size && (buffer[index] >= '0' && buffer[index]
     <= '9'); index++) {
      numberOfPackages += buffer[index];
    }
    if (buffer[index] == '@' && buffer[++index] == '@') {
      ret = stoi(numberOfPackages);
    }
  }
  return ret;
}

int UDPServer::storePackage(std::map<int, std::string> &receivedPackages,
  char* buffer) {
  int error = EXIT_SUCCESS;
  int key = 0;
  std::string strnBuffer(buffer, BUFFER_SIZE);

  // First 4 bits contains the number of package (key)
  key = stoi(strnBuffer.substr(0, 4));
  // Remove first 4 bits from package
  strnBuffer = strnBuffer.substr(4);
  // Check if package has trash (more/equal than $$$)
  size_t pos = strnBuffer.find("$$$");
  // If package has trash, remove trash from string
  if (pos != strnBuffer.npos) {
    strnBuffer = strnBuffer.substr(0, pos);
  }
  // Store package in map
  receivedPackages[key] = strnBuffer;

  return error;
}

void UDPServer::fillWithDollarSigns(std::string& buffer) {
  int bufferVoid = BUFFER_SIZE - buffer.length();
  buffer.append(bufferVoid, '$');
}

void UDPServer::askForMissingPackages(int totalPackages,
   std::map<int, std::string>& receivedPackages, UDPSocket& socket,
    SocketAddress clientAddress) {
  std::string msg;
  std::map<int, std::string>::iterator it;
  for (int index = 0; index < totalPackages; index++) {
    it = receivedPackages.find(index);
    if (it == receivedPackages.end()) {
      std::cout << index << " package is missing\n";
      msg = "&&" + std::to_string(index) + "&&";
      fillWithDollarSigns(msg);
      socket.udpSendto(msg, clientAddress);
    }
  }
}

UDPServer::~UDPServer() {
  int clientsThreadsSize = this->clientsThreads.size();
  for (int index = 0; index < clientsThreadsSize; index++) {
    delete this->clientsThreads[index];
  }
  this->clientsThreads.clear();
}

int UDPServer::writingOnPipe(std::map<int, std::string>& thread_private_map) {
  // Close critical zone
  this->canAccessPipe.lock();

  char buffer[1021];
  std::map<int, std::string>::iterator it;
  for ( it = thread_private_map.begin();
    it != thread_private_map.end(); it++) {
    // Wait to Write on pipe
    sem_wait(this->canWritePipe);
    // my Write Syscall
    sprintf(buffer, "%s", it->second.c_str());
    my_write(this->impresionPipe, buffer, 1021);
    // Signal to Read from pipe (from second process)
    sem_post(this->canReadPipe);
  }
  // Open critical zone
  this->canAccessPipe.unlock();
  return 0;
}

void UDPServer::stopServer() {
  int clientsThreadsSize = this->clientsThreads.size();
  for (int index = 0; index < clientsThreadsSize; index++) {
    this->clientsThreads[index]->join();
    delete this->clientsThreads[index];
  }
  // this->connectionRequestSocket.udpClose();
  std::cout<< "Server stopped" << std::endl;
  this->clientsThreads.clear();
  sem_destroy(canReadPipe);
  sem_destroy(canWritePipe);
  munmap(this->impresionPipe, 1021);
  exit(0);
}


void UDPServer::setWriteSemaphore(sem_t* writeSemaphore) {
  this->canWritePipe = writeSemaphore;
}
void UDPServer::setReadSemaphore(sem_t* readSemaphore) {
  this->canReadPipe = readSemaphore;
}
void UDPServer::setPipe(char* pipe) {
  this->impresionPipe = pipe;
}
