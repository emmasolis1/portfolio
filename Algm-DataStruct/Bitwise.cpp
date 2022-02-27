// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

#include <stdio.h>

// Modify to stop execution on failure:
bool stopOnFail = true;
// Modify to do optionals:
bool testOptionals = true;

bool anyOffUpperByte(unsigned int x){
	return (~x)&0xFF000000;
}

bool anyOddOne(unsigned int x){
	return x&0x55555555;
}

unsigned int times5(unsigned int x){
	return (x<<2)+x;
}

unsigned int times7(unsigned int x){
	return (x<<3)-x;
}

unsigned int lowerBitsMask(unsigned int n){
	return 0xFFFFFFFFU>>(32-n);
}

unsigned int upperBitsMask(unsigned int n){
	return 0xFFFFFFFFU<<(32-n);
}

unsigned int rotateRight(unsigned int x, unsigned int n){
	n &= 0x1F;
	return n?((x>>n) | (x<<(32-n))):x;
}

// Optional exercises:
bool pow2(unsigned int x){
	return x?!(x & (x-1)):false;
}

unsigned int countBitsLoop(unsigned int x){
	unsigned int count = 0;
	while(x){
		x &= x-1;
		count++;
	}
	return count;
}

unsigned int countBitsFixed(unsigned int x){
	static unsigned int ref[256] = {
		0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,
		1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
		1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
		2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
		1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
		2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
		2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
		3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
		1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
		2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
		2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
		3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
		2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
		3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
		3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
		4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8
	};
	return ref[x&0xFF] + ref[(x>>8)&0xFF] + ref[(x>>16)&0xFF] + ref[(x>>24)&0xFF];
}

int total = 0;
int passed = 0;
bool skip = false;
template <typename T> void perform_test(const char* test_name,T (*function)(unsigned int),unsigned int* values,T* results,int tests){
	if(skip && stopOnFail){ return; }
	printf("Performing tests: %s\n",test_name);
	for(int i=0;i<tests;i++){
		unsigned int res = function(values[i]);
		printf("Case %i: %s\n",i,res==results[i]?"PASSED":"FAILED <---");
		if(res==results[i]){ passed++; }
		total++;
	}
	skip = (passed != total);
}
template <typename T> void perform_test(const char* test_name,T (*function)(unsigned int,unsigned int),unsigned int* values,unsigned int* values2,T* results,int tests){
	if(skip && stopOnFail){ return; }
	printf("Performing tests: %s\n",test_name);
	for(int i=0;i<tests;i++){
		unsigned int res = function(values[i],values2[i]);
		printf("Case %i: %s\n",i,res==results[i]?"PASSED":"FAILED <---");
		if(res==results[i]){ passed++; }
		total++;
	}
	skip = (passed != total);
}

int main(){
	
	unsigned int aoubt[] = {0,0xff000000,0x33000000,0xf0000000,0xffffffff};
	bool aoubr[] = {true,false,true,true,false};
	perform_test("anyOffUpperByte",anyOffUpperByte,aoubt,aoubr,5);
	
	unsigned int aoot[] = {0, 1, 2, 0xff, 0x80000000, 0x40000000};
	bool aoor[] = {false, true, false, true, false, true};
	perform_test("anyOddOne",anyOddOne,aoot,aoor,6);
	
	unsigned int t5t[] = {0, 1, 5, 25, 1337, 0x777777};
	unsigned int t5r[] = {0, 5, 25, 125, 6685, 0x2555553};
	perform_test("times5",times5,t5t,t5r,6);
	
	unsigned int t7t[] = {0, 1, 7, 49, 1337, 0x777777};
	unsigned int t7r[] = {0, 7, 49, 343, 9359, 0x3444441};
	perform_test("times7",times7,t7t,t7r,6);
	
	unsigned int lbmt[] = {1, 2, 3, 4, 16};
	unsigned int lbmr[] = {1, 3, 7, 15, 0xffff};
	perform_test("lowerBitsMask",lowerBitsMask,lbmt,lbmr,5);
	
	unsigned int ubmt[] = {1, 2, 3, 4, 16};
	unsigned int ubmr[] = {0x80000000, 0xC0000000, 0xE0000000, 0xF0000000, 0xFFFF0000};
	perform_test("upperBitsMask",upperBitsMask,ubmt,ubmr,5);
	
	unsigned int rrt[] = {0,2,3,0xffff,0xffff};
	unsigned int rrt2[] = {1,1,1,8,36};
	unsigned int rrr[] = {0,1,0x80000001,0xff0000ff,0xf0000fff};
	perform_test("rotateRight",rotateRight,rrt,rrt2,rrr,5);
	
	if(testOptionals){
		unsigned int p2t[] = {0,1,16,17,256,296,65536};
		bool p2r[] = {false, true, true, false, true, false, true};
		perform_test("pow2",pow2,p2t,p2r,7);
		
		unsigned int cbt[] = {0,2,3,0xf,0xff000000,0xCCCCCCCC};
		unsigned int cbr[] = {0,1,2,4,8,16};
		perform_test("countBitsLoop",countBitsLoop,cbt,cbr,6);
		perform_test("countBitsFixed",countBitsFixed,cbt,cbr,6);
	}
	
	printf("Passed %i of %i tests\n",passed,total);
	printf("Press ENTER...");
	fgetc(stdin);
	return 0;
}

