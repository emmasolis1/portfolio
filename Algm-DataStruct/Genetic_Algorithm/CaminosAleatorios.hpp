// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

#ifndef CaminosAleatorios_hpp
#define CaminosAleatorios_hpp

#include <stdio.h>

class CaminosAleatorios{
private:
    unsigned int distanciaTotal; //Es la distancia total al recorrer todas las ciudades segun esta solucion.
    unsigned int cantidadCiudades; //Es la cantidad total de ciudades que deben ser visitadas por el viajero.
    int *ordenVisitacion; //Array en el que se almacena los numeros (indices) del orden en que deben ser visitadas las ciudades.
    float **ciudadesVisitar; //Son las COORDENAS de las ciudades que deben ser visitadas.
public:
    //CONSTRUCTOR
    CaminosAleatorios(float **ciudades, int cantCiudades);
    //DESCTRUCTOR
    ~CaminosAleatorios();
    //SETTERS.
    void setDistanciaTotal(float distancia);
    void setCantidadCiudades(int cantidad);
    void setOrdenVisitacion(int *orden);
    void setCiudadesVisitar(float **ciudades);
    //GETTERS.
    float getDistanciaTotal();
    unsigned int getCantidadCiudades();
    int *getOrdenVisitacion();
    float **getCiudadesVisitar(); //Las COORDENADAS.
    //OTHER METHODS.
    bool ciudadVisitada(int index); //Recibe el indice de una de ciudades que se pide deben visitar, debe buscar en el array ordenVisitacion y saber si esta ya ha sido incluida o no y retornar dicha condicion.
    float obtenerDistancia(float x1, float y1, float x2, float y2); //Recibe las coordenadas de una ciudad y calcula su distancia en base a las coordenadas de la ultima ciudad visitada, es decir en la que se encuentra.
    void obtenerCamino(); //Algoritmo principal que se encarga de buscar el camino de forma aleatoria, debo tomar en cuenta el calcular las distancias en base a la ultima posicion que me encontraba.
};

#endif /* CaminosAleatorios_hpp */
