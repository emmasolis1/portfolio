#include <map>
#include <string>
#include <utility>
#include <vector>
#include <list>
#include <iostream>
#include "Graph.h"

Graph::Graph(Vertices v,Edges e,bool directed) {
  if(directed == true) {
    // Directed graph
    // Created the list.s
    for(int i=0; i<e.size(); i++) {
      my_list.push_back(v[i]);
      my_list.insert(i, v[i][1]);
      my_map.insert(std::pair<std::string, int>(v[i], int(v[i][0])));
    }
  } else {
    for(int i=0; i<e.size(); i++) {
      my_list.push_back(v[i]);
      my_map.insert(std::pair<std::string, int>(v[i], int(v[i][0])));
    }
  }
}

Graph::~Graph() {
  delete my_list;
  delete my_map;
}

Graph::getMinimumSpanningTree() {

}

Graph::getPaths() {

}

Graph::getStronglyConnectedComponents() {

}