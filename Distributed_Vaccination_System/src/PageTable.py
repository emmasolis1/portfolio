class Node:
    def __init__(self, id):
        self.__PAGE_ID = id
        self.validityBit = 0
        self.address = -1
        self.nextNode = None

    def getPageID(self):
        return self.__PAGE_ID


class PageTable:
    def __init__(self, routingInfoSlots):
        self.__MAX_PAGE_NUM = int(routingInfoSlots / 2 + routingInfoSlots % 2)  # Maximum number of pages = 20
        self.__listHead = self.linkNodes()

    def linkNodes(self):
        headNode = Node(0)
        tailNode = headNode
        for counter in range(1, self.__MAX_PAGE_NUM):
            newNode = Node(counter)
            tailNode.nextNode = newNode
            tailNode = newNode
        return headNode

    def getPageNode(self, nodeId):
        auxNode = None
        if nodeId >= 0 and nodeId < self.__MAX_PAGE_NUM:
            auxNode = self.__listHead
            for i in range(nodeId):
                auxNode = auxNode.nextNode
        return auxNode

    def getPageAddress(self, nodeId):
        auxNode = None
        if nodeId >= 0 and nodeId < self.__MAX_PAGE_NUM:
            auxNode = self.__listHead
            for i in range(nodeId):
                auxNode = auxNode.nextNode
        return auxNode.address

    def isItInRam(self, pageIndex):
        if self.getPageNode(pageIndex).validityBit == 1:
            return True
        return False
