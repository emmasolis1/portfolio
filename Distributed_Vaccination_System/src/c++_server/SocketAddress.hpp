#ifndef SOCKETADDRESS_H
#define SOCKETADDRESS_H

#include <string>

#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h> // Definitions for network database
#include <sys/socket.h> // Define socket header strucutre
#include <sys/types.h> // For diferent types needed

class SocketAddress {
  public:
    struct sockaddr_in socketAddress;
    int sockAddrLen;

    /** 
     * @brief Default Constructor
    */
    SocketAddress();

    /** 
     * @brief Copy Constructor
    */
    SocketAddress(const SocketAddress &rhsSocket);

    /** 
     * @brief Operator = overload
    */
    void operator=(const SocketAddress &rhsSocket);
  
    /** 
     * @brief It binds the struct sockaddr_in to the received ip and port
     * @param inetAddr A std::string containing the ip address
     * @param port Contains the port value
    */
    void bindAddress(std::string inetAddr, int port);

    /** 
     * @brief Function to get a std::string in format: ip: ip port: port
     * @return A std::string containing th eip and port information
    */
    std::string getStringAddress();

  private:
    /** 
     * @brief Creates a struct sockaddr_in binded to the received ip and port
     * @param inetAddr A std::string containing the ip address
     * @param port Contains the port value
     * @return A struct sockaddr_in binded to the received ip and port
    */
    struct sockaddr_in getSocketAddress(std::string inetAddr, int port);
};

#endif  // SOCKETADDRESS_H