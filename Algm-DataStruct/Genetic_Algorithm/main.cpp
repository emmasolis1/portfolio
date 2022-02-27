// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

#include <iostream>
#include "TravellingSalesman.hpp"
#include "CaminosAleatorios.hpp"
//#include "GeneticAlgorithm.h"
//#include "GeneticAlgorithmCases.cpp"
//#include "GeneticAlgorithmVisualizer.cpp"
using namespace std;

int main(int argc, const char * argv[]) {
    srand(time(0));
    
    float caseLAU15[15][2] = {
        {0.0,        0.0},
        {-28.8733,    0.0},
        {-79.2916,    -21.4033},
          {-14.6577,    -43.3896},
          {-64.7473,     21.8982},
          {-29.0585,    -43.2167},
          {-72.0785,    0.181581},
          {-36.0366,    -21.6135},
          {-50.4808,     7.37447},
          {-50.5859,    -21.5882},
         {-0.135819,    -28.7293},
          {-65.0866,    -36.0625},
          {-21.4983,     7.31942},
          {-57.5687,    -43.2506},
          {-43.0700,     14.5548}
    };
    
    float **cases = new float*[15];
    for(int i=0; i<15; i++){
        cases[i] = new float[2];
    }
    for(int i=0; i<15; i++){
        for(int j=0; j<2; j++){
            cases[i][j] = caseLAU15[i][j];
        }
    }
    
    TravellingSalesman *solve = new TravellingSalesman(15, 0.35, 0.35, 0.30);
    solve->setCiudadesVisitar(cases);
    solve->setCantidadCiudades(15);
    solve->epoch(); //Se ejecutan 5 epocas, segun configurado en el metodo.
    
    cout<<"NOTA: NO se hizo la interfaz grafica pues el profesor lo indico de esa forma dado que el paquete necesario no parecia estar disponible para las Mac de Apple."<<endl;
    
    //Llamado a los destructores.
    solve->~TravellingSalesman();
    
    return 0;
}
