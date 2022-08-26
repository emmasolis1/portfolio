#include "Graph.h"
#include <iostream>
#include <stdio.h>

int main(){
	
	Vertices v1 = {"a","b","c","d","e","f","g","h","i","j"};
	Edges e1 = {
		{{"a","c"},1},
		{{"c","b"},1},
		{{"b","a"},1},
		{{"b","d"},1},
		{{"d","e"},1},
		{{"e","d"},1},
		{{"e","f"},1},
		{{"e","g"},1},
		{{"g","h"},1},
		{{"f","h"},1},
		{{"h","e"},1},
		{{"h","i"},1},
	};
	
	Graph* g = new Graph(v1,e1,true);
	
	std::vector<Vertices> groups = g->getStronglyConnectedComponents();
	if(groups.size() != 4){ std::cout << "ERROR: expected 4 groups!" << std::endl; }
	// Print groups
	std::cout << "Groups found: " << groups.size() << std::endl;
	for(int i=0;i<groups.size();i++){
		std::cout << "Group "<< i << ":";
		const Vertices v = groups.at(i);
		for(int j=0;j<v.size();j++){
			std::cout << " " << v.at(j);
		}
		std::cout << std::endl;
	}
	
	delete g;
	
	Edges e2 = {
		{{"a","b"},3},
		{{"a","c"},9},
		{{"b","c"},9},
		{{"a","d"},6},
		{{"b","d"},4},
		{{"b","e"},2},
		{{"d","e"},2},
		{{"c","f"},8},
		{{"b","f"},9},
		{{"e","f"},8},
		{{"d","g"},9},
		{{"e","g"},9},
		{{"f","g"},7},
		{{"g","h"},4},
		{{"f","i"},9},
		{{"g","i"},5},
		{{"h","i"},1},
		{{"c","j"},18},
		{{"f","j"},10},
		{{"h","j"},4},
		{{"i","j"},3}
	};
	
	g = new Graph(v1,e2,false);
	
	Edges emst = g->getMinimumSpanningTree();
	
	if(emst.size()!=9){ std::cout << "ERROR: expected 9 edges!" << std::endl; }
	
	// Print edges
	for(int i=0;i<emst.size();i++){
		std::cout << "Edge " << i << ": " << emst.at(i).first.first << " - " << emst.at(i).first.second << std::endl;
	}
	
	delete g;
	
	/*
		Expected solutions: (numbering/order/direction irrelevant)
			Strong connected groups:
				Group 0: a b c
				Group 1: d e f g h
				Group 2: i
				Group 3: j
			Minimum spanning tree:
				Edge 0: a-b
				Edge 1: b-e
				Edge 2: d-e
				Edge 3: e-f
				Edge 4: c-f
				Edge 5: f-g
				Edge 6: g-h
				Edge 7: h-i
				Edge 8: i-j
	*/
	
	printf("Finished, press ENTER...");
	fgetc(stdin);
	return 0;
}
