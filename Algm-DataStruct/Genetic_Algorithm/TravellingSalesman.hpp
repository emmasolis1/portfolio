// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

#ifndef TravellingSalesman_hpp
#define TravellingSalesman_hpp

#include <stdio.h>
#include "GeneticAlgorithm.h"
#include "CaminosAleatorios.hpp"

class TravellingSalesman : public GeneticAlgorithm{ //A son class.
private:
    CaminosAleatorios *crossover(CaminosAleatorios *padre1, CaminosAleatorios *padre2); //Recibe dos padres y mezcla sus soluciones para crear de ellas solo una.
    void *mutation(CaminosAleatorios *uniforme); //Recibe una solucion que se esta volviendo uniforme y la mezcla.
    float fitness(CaminosAleatorios *camino); //Recibe una solucion y calcula la DISTANCIA TOTAL recorrida, tomando en cuenta que de la ultima ciudad debe devolverse a la primera.
public:
    //ATRIBUTOS.
    CaminosAleatorios **soluciones; //Arreglo para almacenar las posibles soluciones.
    float **ciudadesVisitar;
    int cantidadCiudades;
    //METODOS.
    TravellingSalesman(int populationSize, float elitismRatio, float mutationRatio, float sporadicRatio) : GeneticAlgorithm(populationSize, elitismRatio, mutationRatio, sporadicRatio){};
    void reset(int populationSize,float elitismRatio,float mutationRatio,float sporadicRatio);
    void epoch(); //Uno de los metodos MAS IMPORTANTE.
    void setCiudadesVisitar(float **ciudades);
    float getBestIndividual(); //Obtiene y retorna la distancia total de recorrido del mejor individuo de la población.
    void drawBestIndividual(float** points,unsigned int &numPoints); //Obtiene la representacion de puntos en el plano cartesiano y guarda la cantidad de ciudades que se han de visitar.
    //SETTERS EXTRAS.
    void setSoluciones(CaminosAleatorios **soluciones){this->soluciones=soluciones;}
    void setCantidadCiudades(int cant){
        this->cantidadCiudades = cant;
        this->populationSize = cant;
    }
    //GETTERS EXTRAS.
    CaminosAleatorios **getSoluciones(){return soluciones;}
    //Metodos EXTRAS.
};

#endif /* TravellingSalesman_hpp */
