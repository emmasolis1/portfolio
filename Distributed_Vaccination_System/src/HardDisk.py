class HardDisk:
    def __init__(self, routingInfoSlots):
        self.__PAGE_SIZE = 58  # Page size = 58 bytes
        self.__IPADDR_SIZE = 29
        self.__MAX_PAGE_NUM = int(routingInfoSlots / 2 + routingInfoSlots % 2)
        self.__buffer = bytearray(
            [48] * self.__PAGE_SIZE * self.__MAX_PAGE_NUM
        )  # 1160 bytes

    def getPageAt(self, fisicalAddr):
        returnVar = None
        returnVar = self.__buffer[fisicalAddr : fisicalAddr + self.__PAGE_SIZE]
        return returnVar

    def setPageAt(self, data, fisicalAddr):
        self.__buffer[fisicalAddr : fisicalAddr + len(data)] = data

    def setIpAtPage(self, data, fisicalAddr, ipIndex):
        startingPos = fisicalAddr + ipIndex * self.__IPADDR_SIZE
        self.__buffer[startingPos : startingPos + len(data)] = data
