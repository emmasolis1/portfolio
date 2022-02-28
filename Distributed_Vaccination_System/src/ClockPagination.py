class ClockNode:
    def __init__(self):
        self.nodeID = 0
        self.referenceBit = 0
        self.modifiedBit = 0
        self.pageNumber = -1
        self.ramAddr = -1
        self.nextNode = None


class ClockPagination:
    def __init__(self, frames):
        self.frameCount = int(frames / 2 + frames % 2)
        self.faultCounter = 0
        self.listHead = self.initList()
        self.clockPointer = self.listHead

    def initList(self):
        headNode = ClockNode()
        tailNode = headNode
        for counter in range(1, self.frameCount):
            newNode = ClockNode()
            newNode.nodeID = counter
            tailNode.nextNode = newNode
            tailNode = newNode
        tailNode.nextNode = headNode
        return headNode
    
    def getNode(self, nodeIndex):
        auxNode = None
        if nodeIndex >= 0 and nodeIndex < self.frameCount:
            auxNode = self.listHead
            for i in range(nodeIndex):
                auxNode = auxNode.nextNode
        return auxNode

    def getNodeByRam(self, ramAddr):
        auxNode = None
        auxNode = self.listHead
        for i in range(8):
            if ramAddr == auxNode.ramAddr:
                break
            auxNode = auxNode.nextNode
        return auxNode


    def overwriteNode(self, node, pageIndex):
        node.referenceBit = 0
        node.modifiedBit = 0
        node.pageNumber = pageIndex

    def isPageModified(self, node):
        if node.modifiedBit == 1:
            return True
        return False
