#ifndef UDPSOCKET_H
#define UDPSOCKET_H

#include "SocketAddress.hpp"

class UDPSocket {
  private:
    int socketDescriptor;
    SocketAddress socketAddress;

  public:
    /** 
     * @brief Default Constructor
    */
    UDPSocket();

    /** 
     * @brief Default Destructor
    */
    ~UDPSocket();

    /** 
     * @brief Binds the socket to the received ip and port
     * @param inetAddr A std::string containing the ip address
     * @param port Contains the port value
     * @return EXIT_SUCCESS or EXIT_FAILURE
    */
    int udpBind(std::string inetAddr, int port);

    /** 
     * @brief Sends information to the received ip and port
     * @param msg A std::string containing the information
     * @param inetAddr A std::string containing the ip address
     * @param port Contains the port value
     * @return EXIT_SUCCESS or EXIT_FAILURE
    */
    int udpSendto(std::string msg, std::string inetAddr, int port);
  
    /** 
     * @brief Sends information to the given SocketAddress
     * @param msg A std::string containing the information
     * @param recvSockAddr The SocketAddress of the reciever
     * @return EXIT_SUCCESS or EXIT_FAILURE
    */
    int udpSendto(std::string msg, SocketAddress& recvSockAddr);

    /** 
     * @brief Receives information from the given SocketAddress
     * @param noBytes The total amount of bytes to receive
     * @param buff The buffer where to store the received information
     * @param sendSockAddr The SocketAddress of the sender
     * @return EXIT_SUCCESS or EXIT_FAILURE
    */
    int udpRecvfrom(int noBytes, char* buff, SocketAddress& sendSockAddr);
  
    /** 
     * @brief Set the socket's timeout when receiving
     * @param seconds Seconds to timeout
     * @param microseconds Microseconds to timeout
     * @return EXIT_SUCCESS or EXIT_FAILURE
    */
    int setRecvTimeOut(int seconds, int microseconds);

    /** 
     * @brief Set the socket's timeout when sending
     * @param seconds Seconds to timeout
     * @param microseconds Microseconds to timeout
     * @return EXIT_SUCCESS or EXIT_FAILURE
    */
    int setSendTimeOut(int seconds, int microseconds);

    /** 
     * @brief Closes the socket
    */
    void udpClose();
};
#endif  // UDPSOCKET_H
