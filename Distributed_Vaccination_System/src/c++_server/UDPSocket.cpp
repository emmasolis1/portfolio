// Copyright 2021 <Emmanuel, Javier, Gilbert, Carlos>

#include <sys/time.h>
#include <unistd.h>
#include <string>
#include "UDPSocket.hpp"


UDPSocket::UDPSocket() {
  this->socketDescriptor = socket(AF_INET, SOCK_DGRAM, 0);
}

UDPSocket::~UDPSocket() {}

int UDPSocket::udpBind(std::string inetAddr, int port) {
  this->socketAddress.bindAddress(inetAddr, port);
  int error = EXIT_SUCCESS;
  struct sockaddr_in* socketAddressPtr = &this->socketAddress.socketAddress;

  if (bind(this->socketDescriptor, (struct sockaddr*) socketAddressPtr,
    this->socketAddress.sockAddrLen) >= 0) {
      // Do nothing.
    } else {
      error = EXIT_FAILURE;
    }
  return error;
}

int UDPSocket::udpSendto(std::string msg, std::string inetAddr, int port) {
  int error = EXIT_SUCCESS;
  int msgLen = msg.length();
  SocketAddress recvSockAddr;
  recvSockAddr.bindAddress(inetAddr, port);
  struct sockaddr_in* recvSockAddressPtr = &recvSockAddr.socketAddress;
  if (sendto(this->socketDescriptor, msg.c_str(), msgLen, 0,
   (struct sockaddr *) recvSockAddressPtr, recvSockAddr.sockAddrLen) >= 0) {
     // Do nothing.
  } else {
    error = EXIT_FAILURE;
  }
  return error;
}

int UDPSocket::udpSendto(std::string msg, SocketAddress& recvSockAddr) {
  int error = EXIT_SUCCESS;
  int msgLen = msg.length();
  if (sendto(this->socketDescriptor, msg.c_str(), msgLen, 0,
   (struct sockaddr *) &recvSockAddr.socketAddress, recvSockAddr.sockAddrLen)
    >= 0) {
  } else {
    error = EXIT_FAILURE;
  }
  return error;
}

int UDPSocket::udpRecvfrom(int noBytes, char* buff,
  SocketAddress& sendSockAddr) {
  int error = EXIT_SUCCESS;
  if (recvfrom(this->socketDescriptor, buff, noBytes, 0,
    (struct sockaddr *) &sendSockAddr.socketAddress,
      (socklen_t*) &sendSockAddr.sockAddrLen) >= 0) {
  } else {
    error = EXIT_FAILURE;
    throw "Timeout expired";
  }
  return error;
}

int UDPSocket::setRecvTimeOut(int seconds, int microseconds) {
  int error = EXIT_SUCCESS;
  struct timeval timeout;
  timeout.tv_sec = seconds;
  timeout.tv_usec = microseconds;

  error = setsockopt(this->socketDescriptor, SOL_SOCKET, SO_RCVTIMEO,
   (struct timeval*) &timeout, sizeof(struct timeval));

  return error;
}

int UDPSocket::setSendTimeOut(int seconds, int microseconds) {
  int error = EXIT_SUCCESS;
  struct timeval timeout;
  timeout.tv_sec = seconds;
  timeout.tv_usec = microseconds;

  error = setsockopt(this->socketDescriptor, SOL_SOCKET, SO_SNDTIMEO,
   (struct timeval*) &timeout, sizeof(struct timeval));

  return error;
}

void UDPSocket::udpClose() {
  close(this->socketDescriptor);
}
