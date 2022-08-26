#include <cstdlib>
#include <iostream>
#include "algorithms.hpp"
#include "algorithms.cpp"
#include <chrono>
#include <fstream>
using namespace std;

bool verificarArreglo(int* arreglo, int n) {
    bool result = true;
    for (int i=1; i<n && result; i++) {
        if (arreglo[i-1] > arreglo[i]) {
            result = false;
        }
    }
    return result;
}
void prepararPruebaUno(int* prueba1, int* prueba2, int* prueba3, int* prueba4, int* prueba5) {
      
    for (int i=0; i<262144; i++) {
        if (i<16384) {
            prueba1[i] = rand()%16384+1;
        }   
        if (i<32768) {
            prueba2[i] = rand()%32768+1;
        }  
        if (i<65536) {
            prueba3[i] = rand()%65536+1;
        }    
        if (i<131072) {
            prueba4[i] = rand()%131072+1;
        } 
        if (i<262144) {
            prueba5[i] = rand()%262144+1; 
        } 
     }
}
void prepararPruebaDos(int* prueba1, int* prueba2, int* prueba3, int* prueba4, int* prueba5) {  
    for (int i=0; i<262144; i++) {
        if (i<16384) {
            prueba1[i] = i+1;
        }   
        if (i<32768) {
            prueba2[i] = i+1;
        }  
        if (i<65536) {
            prueba3[i] = i+1;
        }    
        if (i<131072) {
            prueba4[i] = i+1;
        } 
        if (i<262144) {
            prueba5[i] = i+1;
        } 
     }
}

void prepararPruebaTres(int* prueba1, int* prueba2, int* prueba3, int* prueba4, int* prueba5) {  
    for (int i=0; i<262144; i++) {
        if (i<16384) {
            prueba1[16383-i] = i+1;
        }   
        if (i<32768) {
            prueba2[32767-i] = i+1;
        }  
        if (i<65536) {
            prueba3[65535-i] = i+1;
        }    
        if (i<131072) {
            prueba4[131071-i] = i+1;
        } 
        if (i<262144) {
            prueba5[262143-i] = i+1;
        } 
     }  
}
double* pruebaAlgoritmo(int tipoPrueba, void (*algoritmo)(int * arreglo, int n)) {
     /*crear 5 arreglos */
     /*llamar 3 veces a un tipo de sort para cada uno*/
     /*como son 9 tipos, van a ser 3*15*9 = 405 ejecuciones xd*/
     int* prueba1 = new int[16384];
     int* prueba2 = new int[32768];
     int* prueba3 = new int[65536];
     int* prueba4 = new int[131072];
     int* prueba5 = new int[262144];
     switch(tipoPrueba) {
        case 1:
            prepararPruebaUno(prueba1, prueba2, prueba3, prueba4, prueba5);
            break;
        case 2:
            prepararPruebaDos(prueba1, prueba2, prueba3, prueba4, prueba5);
            break;
        case 3:
            prepararPruebaTres(prueba1, prueba2, prueba3, prueba4, prueba5);
            break;
        default:
            return 0;                   
     }
     /*crear arreglo de mediciones del algoritmo para cada tama�o de arreglo*/
     double* mediciones = new double[5];
     /*ejecutar los algoritmos de ordenamiento*/
     /*medir tiempo entre cada algoritmo*/
     std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
     algoritmo(prueba1, 16384);
     mediciones[0] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();
     tStart =  std::chrono::steady_clock::now();
     algoritmo(prueba2,32768);
     mediciones[1] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();
     tStart =  std::chrono::steady_clock::now();
     algoritmo(prueba3,65536);
     mediciones[2] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();
     tStart =  std::chrono::steady_clock::now();
     algoritmo(prueba4,131072);
     mediciones[3] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();
     tStart =  std::chrono::steady_clock::now();
     algoritmo(prueba5,262144);
     mediciones[4] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();
     if(!verificarArreglo(prueba1, 16384)) {
         cout << "Fallo la prueba " << tipoPrueba << "del arreglo de tamano 16384 para el algoritmo" << endl;
     }
     if(!verificarArreglo(prueba2, 32768)) {
         cout << "Fallo la prueba " << tipoPrueba << "del arreglo de tamano 32768 para el algoritmo" << endl;
     }
     if(!verificarArreglo(prueba3, 65536)) {
         cout << "Fallo la prueba " << tipoPrueba << "del arreglo de tamano 65536 para el algoritmo" << endl;
     }
     if(!verificarArreglo(prueba4, 131072)) {
         cout << "Fallo la prueba " << tipoPrueba << "del arreglo de tamano 131072 para el algoritmo" << endl;
     }
     if(!verificarArreglo(prueba5, 262144)) {
         cout << "Fallo la prueba " << tipoPrueba << "del arreglo de tamano 262144 para el algoritmo" << endl;
     }
     /*terminan las pruebas*/
     delete[] prueba1;
     delete[] prueba2;
     delete[] prueba3;
     delete[] prueba4;
     delete[] prueba5;
     return mediciones;
}
void realizarPruebasAlgoritmo(void (*algoritmo)(int * arreglo, int n), const char* nombre){
    double** matrizExperimentos = new double*[9];
    matrizExperimentos[0] = pruebaAlgoritmo(1, algoritmo);
    matrizExperimentos[1] = pruebaAlgoritmo(1, algoritmo);
    matrizExperimentos[2] = pruebaAlgoritmo(1, algoritmo);
    matrizExperimentos[3] = pruebaAlgoritmo(2, algoritmo);
    matrizExperimentos[4] = pruebaAlgoritmo(2, algoritmo);
    matrizExperimentos[5] = pruebaAlgoritmo(2, algoritmo);
    matrizExperimentos[6] = pruebaAlgoritmo(3, algoritmo);
    matrizExperimentos[7] = pruebaAlgoritmo(3, algoritmo);
    matrizExperimentos[8] = pruebaAlgoritmo(3, algoritmo);
    ofstream archivo;
    archivo.open(nombre);
    for (int i=0; i<9; i++) {
        for (int j=0; j<5; j++) {
            archivo << matrizExperimentos[i][j] << " ";
        }
        archivo << "\n";
    }
    archivo.close();
    for (int i=0; i<9; i++) {
        delete[] matrizExperimentos[i];
    }
    delete[] matrizExperimentos;
}

void probarTodosAlgoritmos() {
    /*cout << "Inicio de pruebas" << endl;
    realizarPruebasAlgoritmo(bubble_sort, "bubble_sort");
    cout << "Prueba Bubble Sort lista" << endl;
    realizarPruebasAlgoritmo(insertion_sort, "insertion_sort");
    cout << "Prueba Insertion Sort lista" << endl;
    realizarPruebasAlgoritmo(selection_sort, "selection_sort");
    cout << "Prueba Selection Sort lista" << endl;
    realizarPruebasAlgoritmo(merge_sort, "merge_sort");
    cout << "Prueba Merge Sort lista" << endl;
    realizarPruebasAlgoritmo(heap_sort, "heap_sort");
    cout << "Prueba Heap Sort lista" << endl;
    realizarPruebasAlgoritmo(quick_sort, "quick_sort");
    cout << "Prueba Quick Sort lista" << endl;
    realizarPruebasAlgoritmo(radix_sort, "radix_sort");
    cout << "Prueba Radix Sort lista" << endl;
    realizarPruebasAlgoritmo(counting_sort, "counting_sort");
    cout << "Prueba Counting Sort lista" << endl;
    realizarPruebasAlgoritmo(shell_sort, "shell_sort");
    cout << "Prueba Shell Sort lista" << endl;*/
    realizarPruebasAlgoritmo(shell_sort_especial, "shell_sort_especial");
    cout << "Prueba Shell Sort Especial lista" << endl;
}
int main()
{
    probarTodosAlgoritmos();
    char c;
    cin>>c;
    return 0;
}
