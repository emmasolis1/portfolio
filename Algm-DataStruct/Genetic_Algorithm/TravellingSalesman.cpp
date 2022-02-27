// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

#include "TravellingSalesman.hpp"
#include <cstdlib> //Para generar numero aleatorios.
#include <time.h>
#include <iostream>
using namespace::std;

//Llama al método reset de la clase padre y reinicia la población del algoritmo genético. Recuerde no tener fugas de memoria.
void TravellingSalesman::reset(int populationSize,float elitismRatio,float mutationRatio,float sporadicRatio){
    //First Step: Llama al metodo reset(param...).
    GeneticAlgorithm::reset(populationSize, elitismRatio, mutationRatio, sporadicRatio);
    //Second step: reinicia la poblacion.
    this->populationSize = 0;
}

void TravellingSalesman::setCiudadesVisitar(float **ciudades){this->ciudadesVisitar = ciudades;}

//Ejecuta una época del algoritmo descrito previamente creando una nueva generación. Recuerde no tener fugas de memoria.
void TravellingSalesman::epoch(){
    //1. First step: numero aleatorio de individuos de la poblacion.
    //TravellingSalesman::populationSize = 3 + rand() % (11 - 1); //Numero aleatorio entre 3-10.
    CaminosAleatorios *solucion[populationSize];
    for(int i=0; i<populationSize; i++){
        //2. Second step: se aplica un algoritmo de evaluación (​fitness​) que obtiene un puntaje numérico de la “calidad” de su solución. Se realiza dentro de dicha clase de forma automatica en el constructor.
        solucion[i] = new CaminosAleatorios(ciudadesVisitar, cantidadCiudades);
    }
    //A partir de aqui esto se repite 5 veces.
    for (int k=0; k==100; k++) {
        //3. Third step: los individuos se ordenan según su evaluación de aptitud, poniendo a los más “aptos” de primero.
        for(int i=0; i<cantidadCiudades-1; ++i){
            if(solucion[i]->getDistanciaTotal() > solucion[i+1]->getDistanciaTotal()){
                std::swap(soluciones[i], soluciones[i+1]);
            }
        }
        //4. Fourth step: Hacer la creacion de una nueva generacion. Elistism.
        unsigned short porcetajeAptitud = 0.35; //15%.
        //4.a Se toman los mas aptos de la seccion anterior, en base a un porcentaje preferiblemente bajo. Elitism.
        unsigned short cantidadElitismSpontaneous = cantidadCiudades*porcetajeAptitud;
        CaminosAleatorios *masAptos[cantidadElitismSpontaneous];
        for(int i=0; i<cantidadElitismSpontaneous; i++){
            masAptos[i] = soluciones[i]; //COPIA las soluciones MAS APTAS, osea las primeras que encuentre.
        }
        //4.b Se crea, en base a un porcentaje bajo, nuevos individuos totalmente nuevos. Spontaneous Generation. Usa el mismo porcentaje que Elitism.
        CaminosAleatorios *elitism[cantidadElitismSpontaneous]; //Son los nuevos individuos, deben ser totalmente nuevos.
        for(int i=0; i<cantidadElitismSpontaneous; i++){elitism[i] = new CaminosAleatorios(ciudadesVisitar, cantidadCiudades);} //Crea las NUEVAS SOLUCIONES.
        //4.c Pasos largos que son dividos en metodos privados para hacer mas facil la ejecucion.
        unsigned short resto = cantidadCiudades - cantidadElitismSpontaneous - cantidadElitismSpontaneous; //Cantidad que debe quedar para el resto de la ejecucion de la epoca.
        cout<<"Funciono bien, la cantidad que va a quedar del resto es: "<<resto<<endl;
        //ULTIMA FASE: Las nuevas soluciones sustituyen a la original.
        //Comenzamos con copiar a las mas aptas. Elitism.
        for(int i=0; i<cantidadElitismSpontaneous; i++){
            solucion[i] = masAptos[i];
        }
        //Pasamos a copiar las generadas espontaneamente.
        for(int i=0; i<cantidadElitismSpontaneous; i++){
            solucion[(i+cantidadElitismSpontaneous)] = elitism[i];
        }
    }
    //El arreglo temporal lo copio al global para guardarlo.
    setSoluciones(solucion);
    
    //Mostrar en pantalla la solucion.
    int *orden = soluciones[0]->getOrdenVisitacion();
    cout<<"Visitar las casas en el siguiente orden, segun la lista de coordenadas:"<<endl;
    for(int i=0; i<populationSize; i++){
        cout<<orden[i]<<endl;
    }
}
float TravellingSalesman::getBestIndividual(){
    CaminosAleatorios *temp = soluciones[0];
    for(int i=1; i<cantidadCiudades; i++){
        if(soluciones[i]->getDistanciaTotal()>temp->getDistanciaTotal()){temp=soluciones[i];}
    }
    return temp->getDistanciaTotal();
}

CaminosAleatorios *crossover(CaminosAleatorios *padre1, CaminosAleatorios *padre2){
    return padre1;
}

void *TravellingSalesman::mutation(CaminosAleatorios *uniforme){
    int ciudadTemp; //Para hacer el intercambio.
    for(int i=0; i<cantidadCiudades; i++){
        ciudadTemp = uniforme->getOrdenVisitacion()[i];
        if((i+1)==cantidadCiudades){
            ciudadTemp = uniforme->getOrdenVisitacion()[i];
            uniforme->getOrdenVisitacion()[i] = uniforme->getOrdenVisitacion()[0];
            uniforme->getOrdenVisitacion()[0] = ciudadTemp;
        } else{
            ciudadTemp = uniforme->getOrdenVisitacion()[i];
            uniforme->getOrdenVisitacion()[i] = uniforme->getOrdenVisitacion()[i+1];
            uniforme->getOrdenVisitacion()[i+1] = ciudadTemp;
        }
    }
    return uniforme;
}

float TravellingSalesman::fitness(CaminosAleatorios *camino){
    float distanciaTotal = 0;
    for(int i=1; i<cantidadCiudades; i++){
        distanciaTotal += camino->obtenerDistancia(ciudadesVisitar[camino->getOrdenVisitacion()[i]][0], ciudadesVisitar[camino->getOrdenVisitacion()[i]][1], ciudadesVisitar[camino->getOrdenVisitacion()[i-1]][0], ciudadesVisitar[camino->getOrdenVisitacion()[i-1]][1]);
    }
    camino->setDistanciaTotal(distanciaTotal);
    return distanciaTotal;
}

void TravellingSalesman::drawBestIndividual(float** points,unsigned int &numPoints){
    int *orden = soluciones[0]->getOrdenVisitacion();
    for (int i=0; i<populationSize; i++) {
        points[i][0] = ciudadesVisitar[orden[i]][0];
        points[i][1] = ciudadesVisitar[orden[i]][1];
    }
    numPoints = populationSize;
}
