class RAM:
    def __init__(self, routingInfoSlots):
        self.__PAGE_SIZE = 58  # Page size = 58 bytes
        self.__MAX_PAGE_NUM = int(routingInfoSlots / 2 + routingInfoSlots % 2)  # Maximum number of pages
        self.framesLoaded = 0
        self.__BUFFER_SIZE = self.__PAGE_SIZE * self.__MAX_PAGE_NUM
        self.__buffer = bytearray(
            [0] * self.__BUFFER_SIZE
            )  # 464 bytes

    def getPageAt(self, physicalAddr):
        returnVar = None
        returnVar = self.__buffer[physicalAddr : physicalAddr + self.__PAGE_SIZE]
        return returnVar

    def setPageAt(self, data, physicalAddr):
        self.__buffer[physicalAddr : physicalAddr + len(data)] = data

    def increaseFramesLoaded(self):
        self.framesLoaded += 1

    def isFullyLoaded(self):
        if self.framesLoaded >= self.__MAX_PAGE_NUM:
            return True
        return False