#ifndef GRAPH_H
#define GRAPH_H
#include <map>
#include <string>
#include <utility>
#include <vector>
#include <list>

using Vertices = std::vector<std::string>;
using Path = std::pair<Vertices,unsigned int>;
using Edge = std::pair<std::string,std::string>;
using Edges = std::vector<std::pair<Edge,unsigned int>>;

// Vertices es un vector de hileras/nombres de vertices
// Path es una pareja de un vector de v�rtices (que representa un camino) y su costo asociado
// Edge es la conexi�n de dos vertices <A,B> tal que: A --> B
// Edges es un vector de pares <Edge,peso>, la conexi�n de A --> B con su peso/distancia asociada

class Graph{
	protected:
		std::list<std::string> my_list;
		std::map<char, int> my_map;
		// TODO: Crear atributos internos
			// Puede usar clases creadas previamente o de la biblioteca estandar como list, vector, map, set, algorithm
	public:
		// TODO: Implementar constructor, si directed es falso, entonces el grafo no es dirigido
		Graph(Vertices v,Edges e,bool directed);
		// TODO: Implementar destructor, no deben haber fugas de memoria
		~Graph();
		// TODO: Implementar getStronglyConnectedComponents que retorna un vector de grupos de Vertices que pertenecen al mismo grupo fuertemente conexo
		std::vector<Vertices> getStronglyConnectedComponents();
		// TODO: getMinimumSpanningTree retorna el vector de ejes que forman el arbol recubridor minimo. 
			// Asuma que el grafo *no* es dirigido y ademas asuma que es un grafo conectado (todos los vertices forman parte del mismo grupo fuertemente conexo)
		Edges getMinimumSpanningTree();
		// TODO: getPaths(source) retorna un mapa que tiene por llaves nodos (string) y dato Path, correspondiente al recorrido desde el nodo source hasta el nodo llave
			// Debe traer el Path hacia todos los dem�s nodos del grafo
		std::map<std::string,Path> getPaths(std::string source);
		// TODO: getPaths() retorna un mapa que tiene por llave una pareja de nodos (Edge) y dato Path, correspondiendo al recorrido desde el primer nodo al segundo nodo
			// Debe traer el Path entre todos los nodos pertenecientes al grafo
		std::map<Edge,Path> getPaths();
};

#endif
