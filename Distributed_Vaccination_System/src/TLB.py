class tlbNode:
    def __init__(self):
        self.pageNumber = -1
        self.ramAddress = -1

class TLB:
    def __init__(self):
        self.__MAX_FRAMES_NUM = 3
        self.framePointer = 0
        self.frames = [tlbNode(), tlbNode(), tlbNode()]
        
    def overwrite(self, pageNumber, ramAddr):
        self.frames[self.framePointer].pageNumber = pageNumber
        self.frames[self.framePointer].ramAddress = ramAddr
        self.framePointer = (self.framePointer + 1) % self.__MAX_FRAMES_NUM
    
    def getRamAddress(self, pageNumber):
        if pageNumber >= 0:
            for index in range (self.__MAX_FRAMES_NUM):
                if self.frames[index].pageNumber == pageNumber:
                    return self.frames[index].ramAddress
        return None
