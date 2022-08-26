#ifndef ALGORITHMS_HPP
#define ALGORITHMS_HPP
template<typename data_type> void bubble_sort (data_type* array, int array_size);

template<typename data_type> void insertion_sort(data_type* array, int array_size);

template<typename data_type> void selection_sort (data_type* array, int array_size);

void merge(int* arreglo, int inicio, int mitad, int final);
void mergeSortInner(int* arreglo, int inicio, int final);
void merge_sort(int* arreglo, int final);

int obtenerMaximo (int* array, int padre, int hijoIzq, int hijoDer);
void corregirCima(int* array, int pos, int array_size);
void monticularizar(int* array, int array_size);
void heap_sort (int* array, int array_size);

void pivoteAleatorio(int* lista, int minimum_position, int maximum_position);
int particion(int* lista, int minimum_position, int maximum_position);
void quick_sortInner(int* lista, int minimum_position, int array_size);
void quick_sort(int* lista, int array_size);

template<typename data_type> data_type getMax(data_type* array, int array_size);
template<typename data_type> void counting_sort(data_type* array, int blocks_cant, int exponent);
template<typename data_type> void radix_sort (data_type* array, int array_size);

template<typename tipo> tipo max(tipo* arreglo, int size);
template<typename tipo> void counting_sort (tipo* arreglo, int size);

void shell_sort (int* arreglo, int n);

void shell_sort_especial(int* arreglo, int n);
#endif
