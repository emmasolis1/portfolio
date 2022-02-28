import math

import HardDisk
import PageTable
import RAM
import TLB
import ClockPagination


class MMU:
    def __init__(self, myLogicalIp):
        self.__MY_LOGICAL_IP = myLogicalIp
        self.__PAGE_SIZE = 58
        self.__IPADDR_SIZE = 29
        self.__IS_PROVINCIAL = self.isItProvincial(self.__MY_LOGICAL_IP)
        self.__ROUTING_INFO_DISK_SLOTS = 40 + self.__IS_PROVINCIAL * (-24) # 40 if cantonal, 16 if provincial
        self.__ROUTING_INFO_RAM_SLOTS = 16 + self.__IS_PROVINCIAL * (-8) # 16 if cantonal, 8 if provincial
        self.hardDisc = HardDisk.HardDisk(self.__ROUTING_INFO_DISK_SLOTS)
        self.initializeDiskData()
        self.ram = RAM.RAM(self.__ROUTING_INFO_RAM_SLOTS)
        self.pageTable = PageTable.PageTable(self.__ROUTING_INFO_DISK_SLOTS)
        self.tlb = TLB.TLB()
        self.ramClock = ClockPagination.ClockPagination(self.__ROUTING_INFO_RAM_SLOTS)  # RAM_SIZE

    def getRoutingInfoDiskSlots(self):
        return self.__ROUTING_INFO_DISK_SLOTS

    def isItProvincial(self, myLogicalIp):
        provincialAddr = math.floor(myLogicalIp / 1000) * 1000
        return provincialAddr == myLogicalIp

    # logical ip debe ser un entero
    def getPageAddress(self, logicalIP):
        pageIndex = math.floor(self.translateIpToDiskAddr(logicalIP) / 2)
        return self.askTlbForPageAddress(pageIndex)

    def translateAddress(self, virtualAddr):
        return virtualAddr * self.__PAGE_SIZE

    def translateProvincialIpToDiskAddr(self, ip):
        diskAddr = 0
        if self.isItProvincial(ip):
            myProvince = self.__MY_LOGICAL_IP / 1000
            ipProvince = ip / 1000
            diskAddr = ipProvince - (ipProvince > myProvince)
        return int(diskAddr)

    def translateDiskAddrToProvincialIp(self, diskAddr): #TODO CASE WHERE DISKADDR == 0
        ip = None
        if diskAddr == 0:
            ip = self.__MY_LOGICAL_IP + 10
        else:
            myProvince = self.__MY_LOGICAL_IP / 1000
            ip = (diskAddr + (diskAddr >= myProvince)) * 1000
        return ip

    def translateCantonalIpToDiskAddr(self, ip):
        myAddr = self.__MY_LOGICAL_IP
        base = math.floor(myAddr / 1000) * 1000
        split = (myAddr - base) / 10
        units = ip % 10
        diff = ip - myAddr
        tens = math.floor(diff / 10)
        diskAddr = split + tens + (tens == 0) * (units - 1) + (tens > 0) * 7
        return int(diskAddr)

    def translateDiskAddrToCantonalIp(self, diskAddr):
        myAddr = self.__MY_LOGICAL_IP
        base = math.floor(myAddr / 1000) * 1000
        split = (myAddr % 1000) / 10
        units = (diskAddr >= split and diskAddr <= split + 7) * (
            diskAddr - split + 1
        )
        ip = (
            (diskAddr < split) * (diskAddr * 10)
            + base
            + units
            + (diskAddr > split + 7) * ((diskAddr - 7) * 10)
            + (diskAddr >= split and diskAddr <= split + 7) * (split * 10)
        )
        return int(ip)
    
    def translateIpToDiskAddr(self, ip):
        diskAddr = None
        if self.__IS_PROVINCIAL:
            diskAddr = self.translateProvincialIpToDiskAddr(ip)
        else:
            diskAddr = self.translateCantonalIpToDiskAddr(ip)
        return diskAddr
    
    def translateDiskAddrToIp(self, diskAddr):
        ip = None
        if self.__IS_PROVINCIAL:
            ip = self.translateDiskAddrToProvincialIp(diskAddr)
        else:
            ip = self.translateDiskAddrToCantonalIp(diskAddr)
        return ip

    def initializeDiskData(self):
        diskPageIterator = 0
        auxAddr = 0
        for i in range(self.__ROUTING_INFO_DISK_SLOTS):
            diskPageIterator = math.floor(i / 2)
            auxAddr = self.translateDiskAddrToIp(i)
            data = str(auxAddr)
            self.safeHardDiskSetIp(data, diskPageIterator, i % 2)
    
    # Getters
    def getRoutingNeighborFor(self, ip):
        diskAddr = self.translateIpToDiskAddr(ip)
        return (self.safeRamGetIp(self.askTlbForPageAddress(math.floor(diskAddr / 2)), diskAddr % 2)[5:10]).decode("utf-8")

    def getRoutingWeightFor(self, ip):
        diskAddr = self.translateIpToDiskAddr(ip)
        return (self.safeRamGetIp(self.askTlbForPageAddress(math.floor(diskAddr / 2)), diskAddr % 2)[10:12]).decode("utf-8")

    def getRoutingPhysicalIpFor(self, ip):
        diskAddr = self.translateIpToDiskAddr(ip)
        return (self.safeRamGetIp(self.askTlbForPageAddress(math.floor(diskAddr / 2)), diskAddr % 2)[12:24]).decode("utf-8")

    def getRoutingPortFor(self, ip):
        diskAddr = self.translateIpToDiskAddr(ip)
        return (self.safeRamGetIp(self.askTlbForPageAddress(math.floor(diskAddr / 2)), diskAddr % 2)[24:29]).decode("utf-8")

    # Setters
    def setRoutingNeighborFor(self, ip, data):
        diskAddr = self.translateIpToDiskAddr(ip)
        ram_addr = self.askTlbForPageAddress(math.floor(diskAddr / 2))
        self.safeRamSetIp(data, ram_addr, diskAddr % 2, 5) 
        self.ramClock.getNodeByRam(ram_addr).modifiedBit = 1


    def setRoutingWeightFor(self, ip, data):
        diskAddr = self.translateIpToDiskAddr(ip)
        ram_addr = self.askTlbForPageAddress(math.floor(diskAddr / 2))
        self.safeRamSetIp(data, ram_addr, diskAddr % 2, 10) 
        self.ramClock.getNodeByRam(ram_addr).modifiedBit = 1

    def setRoutingPhysicalIpFor(self, ip, data):
        diskAddr = self.translateIpToDiskAddr(ip)
        ram_addr = self.askTlbForPageAddress(math.floor(diskAddr / 2))
        self.safeRamSetIp(data, ram_addr, diskAddr % 2, 12) 
        self.ramClock.getNodeByRam(ram_addr).modifiedBit = 1

    def setRoutingPortFor(self, ip, data):
        diskAddr = self.translateIpToDiskAddr(ip)
        ram_addr = self.askTlbForPageAddress(math.floor(diskAddr / 2))
        self.safeRamSetIp(data, ram_addr, diskAddr % 2, 24) 
        self.ramClock.getNodeByRam(ram_addr).modifiedBit = 1

    # HardDisk - RAM functions
    def safeHardDiskSetPage(self, data, virtualAddr):
        if type(data) != bytearray:
            data = data.encode("utf-8")
        self.hardDisc.setPageAt(data, self.translateAddress(virtualAddr))

    def safeHardDiskGetPage(self, virtualAddr):
        return self.hardDisc.getPageAt(self.translateAddress(virtualAddr))

    def safeRamSetPage(self, data, virtualAddr):
        if type(data) != bytearray:
            data = data.encode("utf-8")
        self.ram.setPageAt(data, self.translateAddress(virtualAddr))

    def safeRamGetPage(self, virtualAddr):
        return self.ram.getPageAt(self.translateAddress(virtualAddr))

    def safeHardDiskSetIp(self, data, virtualAddr, halfPage):
        if type(data) != bytearray:
            data = data.encode("utf-8")
        self.hardDisc.setIpAtPage(data, self.translateAddress(virtualAddr), halfPage)

    def safeRamSetIp(self, data, virtualAddr, halfPage, startingByte):
        if type(data) != bytearray:
            data = data.encode("utf-8")
        ramAddr = self.translateAddress(virtualAddr) + halfPage * self.__IPADDR_SIZE + startingByte
        self.ram.setPageAt(data, ramAddr)

    def safeRamGetIp(self, virtualAddr, halfPage):
        addrPad = halfPage * self.__IPADDR_SIZE
        return self.safeRamGetPage(virtualAddr)[0 + addrPad : 29 + addrPad]

    def loadFromDiskToRam(self, diskPageAddr, ramPageAddr):
        auxPage = self.safeHardDiskGetPage(diskPageAddr)
        self.safeRamSetPage(auxPage, ramPageAddr)

    def loadFromRamToDisk(self, ramPageAddr, diskPageAddr):
        auxPage = self.safeRamGetPage(ramPageAddr)
        self.safeHardDiskSetPage(auxPage, diskPageAddr)

    # RAM - TLB functions
    def loadFromRamToTLB(self, ramPageAddr, tlbPageAddr):
        auxPage = self.safeRamGetPage(ramPageAddr)
        self.tlb.setNode(tlbPageAddr, auxPage)

    # Clock - PageTable

    def reportAddedToRam(self, pageIndex, ramAddr):
        auxNode = self.pageTable.getPageNode(pageIndex)
        auxNode.validityBit = 1
        auxNode.address = ramAddr
        if not self.ram.isFullyLoaded():
            auxNode = self.ramClock.getNode(self.ram.framesLoaded)
            auxNode.pageNumber = pageIndex
            auxNode.ramAddr = ramAddr
            self.ramClock.faultCounter += 1

    def reportDeletedToRam(self, pageIndex):
        auxNode = self.pageTable.getPageNode(pageIndex)
        auxNode.validityBit = 0
        auxNode.address = -1

    # Clock - RAM

    def addToRam(self, pageIndex, ramAddr):
        self.loadFromDiskToRam(pageIndex, ramAddr)
        self.reportAddedToRam(pageIndex, ramAddr)

    def deleteFromRam(self, ramAddr, node):
        if node.modifiedBit == 1:
            self.loadFromRamToDisk(ramAddr, node.pageNumber)
        self.reportDeletedToRam(node.pageNumber)

    # Ram pagination functions

    def findAndUpdate(self, pageIndex):
        if self.pageTable.isItInRam(pageIndex):
            auxNode = self.ramClock.listHead
            for i in range(self.ramClock.frameCount):
                if auxNode.pageNumber == pageIndex:
                    auxNode.referenceBit = 1
                    break
                auxNode = auxNode.nextNode
            return auxNode.ramAddr
        else:
            self.ramClock.faultCounter += 1
            return None

    def replaceAndUpdate(self, pageIndex):
        ramAddress = None
        while True:
            if self.ramClock.clockPointer.referenceBit == 0:
                # Replace pointed node by new page
                self.replacePageProtocol(self.ramClock.clockPointer, pageIndex)
                ramAddress = self.ramClock.clockPointer.ramAddr
                self.ramClock.clockPointer = self.ramClock.clockPointer.nextNode
                break
            else:
                self.ramClock.clockPointer.referenceBit = 0
                self.ramClock.clockPointer = self.ramClock.clockPointer.nextNode
        return ramAddress

    def ramClockPaginate(self, pageIndex):
        address = self.findAndUpdate(pageIndex)
        if address == None:
            address = self.replaceAndUpdate(pageIndex)
        return address

    def replacePageProtocol(self, clockNode, pageIndex):
        ramAddress = clockNode.ramAddr
        self.deleteFromRam(ramAddress, clockNode)
        self.addToRam(pageIndex, ramAddress)
        self.ramClock.overwriteNode(clockNode, pageIndex)

    # TLB pagination functions

    def askTlbForPageAddress(self, pageIndex):
        if not self.ram.isFullyLoaded():
            ramAddress = None
            if self.pageTable.isItInRam(pageIndex):
                ramAddress = self.pageTable.getPageAddress(pageIndex)
            else:
                ramAddress = self.ram.framesLoaded
                self.addToRam(pageIndex, ramAddress)
                self.ram.increaseFramesLoaded()
            return ramAddress
        ramAddress = self.tlb.getRamAddress(pageIndex)
        if ramAddress == None:
            ramAddress = self.ramClockPaginate(pageIndex)
            self.tlb.overwrite(pageIndex, ramAddress)
        return ramAddress


"""mmu = MMU(12000)

mmu.safeHardDiskSetPage("1201000000000000000000000000001000vvvvvppffffffffffffuuuuu", 0)

mmu.setRoutingNeighborFor(1000, "aaaaa")
mmu.setRoutingWeightFor(1000, "zz")

print("Ram: ")
for i in range(8):
    print(mmu.safeRamGetPage(i))

#mmu.setRoutingNeighborFor(1000, "aaaaa")



#print("Hard disk")
#for i in range(20):
#    print(mmu.safeHardDiskGetPage(i))

print(mmu.getRoutingNeighborFor(1000))
print(mmu.getRoutingWeightFor(1000))
print(mmu.getRoutingPhysicalIpFor(1000))
print(mmu.getRoutingPortFor(1000))"""
