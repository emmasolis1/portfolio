//
//  Stack.cpp
//  Lab07
//
//  Created by Emmanuel Solis on 11/21/20.
//

#include <stdio.h>
#include "LinearDataStructure.hpp"
#include "EmptyException.cpp"

template <typename tipo>
class Queue : LinearDataStructure<class datos> {
private:
    class Nodo{
    public:
        tipo *dato;
        Nodo *siguiente;
        
        Nodo(tipo *data){
            this->dato=data;
            this->siguiente=NULL;
        }
        void setDato(tipo *data){this->dato=data;}
        void setSiguiente(Nodo *next){this->siguiente = next;}
        tipo *getDato(){return dato;}
        Nodo *getSiguiente(){return siguiente;}
    };
public:
    Nodo *cabeza;
    
    //Retorna un elemento de la lista, a la vez que lo elimina.
    datos *pop() override{
        Nodo *tmp = cabeza;
        cabeza = cabeza->getSiguiente();
        return tmp;
    }
    
    void push(tipo *data) override{
        if(stock==0){
            cabeza = new Nodo(data);
        } else {
            Nodo *tmp = new Nodo(data);
            tmp->setSiguiente(cabeza);
        }
    }
};
