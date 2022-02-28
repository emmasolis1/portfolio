// Copyright 2021 Javier, Emmanuel, Gilbert y Carlos <ucr.ac.cr>
#include <cstring>
#include "SocketAddress.hpp"

SocketAddress::SocketAddress() {
  this->sockAddrLen = sizeof(struct sockaddr_in);
  memset(&this->socketAddress, 0, sizeof(this->socketAddress));
}

SocketAddress::SocketAddress(const SocketAddress &rhsSocket) {
  this->socketAddress = rhsSocket.socketAddress;
  this->sockAddrLen = rhsSocket.sockAddrLen;
}

void SocketAddress::operator=(const SocketAddress &rhsSocket) {
  this->socketAddress = rhsSocket.socketAddress;
  this->sockAddrLen = rhsSocket.sockAddrLen;
}

void SocketAddress::bindAddress(std::string inetAddr, int port) {
  this->socketAddress = getSocketAddress(inetAddr, port);
}

struct sockaddr_in SocketAddress::getSocketAddress(std::string inetAddr,
 int port) {
  struct sockaddr_in socketAddress;
  std::fill_n((char*) &socketAddress, sizeof(socketAddress), '\0');
  socketAddress.sin_family = AF_INET;
  socketAddress.sin_addr.s_addr = inet_addr(inetAddr.c_str());
  socketAddress.sin_port = htons(port);
  return socketAddress;
}

std::string SocketAddress::getStringAddress() {
  std::string stringAddress = "ip: ";
  char ipAddrStr[50];
  inet_ntop(AF_INET, &(this->socketAddress.sin_addr), ipAddrStr, 50);
  std::string ipString(ipAddrStr);
  stringAddress += ipString + " port: " +
  std::to_string(ntohs(this->socketAddress.sin_port));
  return stringAddress;
}
