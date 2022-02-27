// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

#include "CaminosAleatorios.hpp"
#include <cmath>

//CONSTRUCTOR
CaminosAleatorios::CaminosAleatorios(float **ciudades, int cantCiudades){
    this->ciudadesVisitar = ciudades;
    this->cantidadCiudades = cantCiudades;
    distanciaTotal = 0;
    //Ejecuto el codigo principal.
    obtenerCamino();
}
//DESCTRUCTOR
CaminosAleatorios::~CaminosAleatorios(){}
//SETTERS
void CaminosAleatorios::setDistanciaTotal(float distancia){this->distanciaTotal=distancia;}
void CaminosAleatorios::setCantidadCiudades(int cantidad){this->cantidadCiudades=cantidad;}
void CaminosAleatorios::setOrdenVisitacion(int *orden){this->ordenVisitacion=orden;}
void CaminosAleatorios::setCiudadesVisitar(float **ciudades){this->ciudadesVisitar=ciudades;}
//GETTERS
float CaminosAleatorios::getDistanciaTotal(){return distanciaTotal;}
unsigned int CaminosAleatorios::getCantidadCiudades(){return cantidadCiudades;}
int *CaminosAleatorios::getOrdenVisitacion(){return ordenVisitacion;}
float **CaminosAleatorios::getCiudadesVisitar(){return ciudadesVisitar;}
bool CaminosAleatorios::ciudadVisitada(int index){
    bool condicion = false;
    for(int i=0; i<cantidadCiudades; i++){
        if(ordenVisitacion[i]==index){
            condicion=true;
            break;
        }
    }
    return condicion;
}
float CaminosAleatorios::obtenerDistancia(float x1, float y1, float x2, float y2){
    float distancia = sqrt((x2-x1)+(y2-y1)); //Formula de la distancia entre dos puntos.
    return distancia;
}
void CaminosAleatorios::obtenerCamino(){
    //Inicializo el array de ordenVisitacion.
    ordenVisitacion = new int[cantidadCiudades];
    for(int i=0; i<cantidadCiudades; i++){ordenVisitacion[i] = -1;} //-1 indica que es NULL.
    //Inicializo el saber mi ultima posicion.
    float **ultimaPosicion = new float*[cantidadCiudades]; //Es la ultima coordenada en la que estuve.
    for(int i=0; i<cantidadCiudades; i++){
        ultimaPosicion[i] = new float[2];
    }
    ultimaPosicion[0][0] = 0;
    ultimaPosicion[0][1] = 0;
    int ciudadEscogida;
    //MAIN ALGORITHM
    for(int i=0; i<cantidadCiudades; i++){
        //Primero escojo una ciudad.
        ciudadEscogida = (rand() % cantidadCiudades);
        //Segundo averiguo si esa ciudad ya ha sido tomada en cuenta.
        if(ciudadVisitada(ciudadEscogida)==false){
            //Tercero agrego esa ciudad a mi posible recorrido.
            ordenVisitacion[i] = ciudadEscogida;
            //Cuarto averiguo su distancia y aumento mi distancia total.
            distanciaTotal += obtenerDistancia(ultimaPosicion[0][0], ultimaPosicion[0][1], ciudadesVisitar[i][0], ciudadesVisitar[i][1]);
            //Quinto y ultimo actualizo mi nueva posicion.
            ultimaPosicion[0][0] = ciudadesVisitar[i][0];
            ultimaPosicion[0][1] = ciudadesVisitar[i][1];
        } else {
            i--; //En caso de haber escogido una ciudad que ya habia sido tomada en cuenta hara que siempre repita el proceso en el mismo punto hasta usar una que no haya sido tomada en cuenta.
        }
    }
    //Tomo en cuenta que me deseo devolver hasta la primer ciudad que visite.
    distanciaTotal+=obtenerDistancia(ciudadesVisitar[ordenVisitacion[cantidadCiudades-1]][0], ciudadesVisitar[ordenVisitacion[cantidadCiudades-1]][1], ciudadesVisitar[ordenVisitacion[0]][0], ciudadesVisitar[ordenVisitacion[0]][1]);
    //AL TERMINAR ESTE ALGORITMO YA DEBO TENER EL POSIBLE ORDEN DE RECORRIDO PARA CADA POSIBLE SOLUCION.
}
