#include <iostream>
#include <stdio.h>
#include <cstdlib>
#include <time.h>
#include <cmath>
#include "algorithms.hpp"
using namespace std;
// -------------------------------- BUBBLE SORT ----------------------------------------

template <typename data_type>
void bubble_sort(data_type *array, int array_size)
{
  for (int i = 0; i < array_size - 1; i++)
  {
    // Last i elements are already in place
    for (int j = 0; j < array_size - i - 1; j++)
    {
      if (array[j] > array[j + 1])
      {
        swap(array[j], array[j + 1]);
      }
    }
  }
}

// -------------------------------- INSERTION SORT ----------------------------------------

/**
 * @brief The Insertion Sort Algorithm.
 * 
 * @param array is the array that want to sort.
 * @param array_size is the numbers of elements in the array.
 */
template <typename data_type>
void insertion_sort(data_type *array, int array_size)
{
  for (int i = 0; i < array_size; i++)
  {
    for (int j = i; j > 0; j--)
    {
      if (array[j - 1] > array[j])
      {
        data_type temp = array[j - 1];
        array[j - 1] = array[j];
        array[j] = temp;
      }
    }
  }
}

// -------------------------------- SELECTION SORT ----------------------------------------

/**
 * @brief The Selection Sort Algorithm.
 * 
 * @param array is the array that want to sort.
 * @param array_size is the numbers of elements in the array.
 */
template <typename data_type>
void selection_sort(data_type *array, int array_size)
{
  for (int i = 0; i < array_size; i++)
  {
    int minimum_position = i;
    data_type minimum_data = array[i];
    for (int j = i + 1; j < array_size; j++)
    {
      if (array[j] < minimum_data)
      {
        minimum_data = array[j];
        minimum_position = j;
      }
    }
    array[minimum_position] = array[i];
    array[i] = minimum_data;
  }
}

// -------------------------------- MERGE SORT ----------------------------------------

/**
 * @brief This is subroutine from merge_sort
 * @details It mixes an array receive according to the merge algortihm.
 * @param array is the array that need to mix.
 * @param minimum_position is the below position from where to mix.
 * @param half_position is the half point between the minimum and the maximum. 
 * @param maximum_position is the top position to mix.
 */
void ordenar(int *lista, int min, int mit, int max)
{
  int i = 0;
  int *lisAux = new int[max - min + 1];
  for (int j = 0; j < max - min + 1; j++)
  {
    lisAux[j] = 0;
  }

  int nuevoMin = min;
  int nuevoMit = mit + 1;
  while (nuevoMin <= mit && nuevoMit <= max)
  {

    if (lista[nuevoMin] < lista[nuevoMit])
    {
      lisAux[i] = lista[nuevoMin];
      nuevoMin++;
      i++;
    }
    else
    {
      lisAux[i] = lista[nuevoMit];
      nuevoMit++;
      i++;
    }
  }

  while (nuevoMin <= mit)
  {
    lisAux[i] = lista[nuevoMin];
    i++;
    nuevoMin++;
  }

  while (nuevoMit <= max)
  {
    lisAux[i] = lista[nuevoMit];
    i++;
    nuevoMit++;
  }

  for (int j = min; j <= max; j++)
  {
    lista[j] = lisAux[j - min];
  }

  delete[] lisAux;
}

/**
 * @brief The Merge Sort Algorithm.
 * @param array is the array that want to sort.
 * @param array_size is the numbers of elements in the array.
 */
void mergeSortInner(int *lista, int min, int max)
{
  int mit = (min + max) / 2;
  if (min < max)
  {
    mergeSortInner(lista, min, mit);
    mergeSortInner(lista, mit + 1, max);
    ordenar(lista, min, mit, max);
  }
}

void merge_sort(int *lista, int array_size)
{
  mergeSortInner(lista, 0, array_size - 1);
}

// -------------------------------- HEAP SORT ----------------------------------------

int obtenerMaximo(int *array, int padre, int hijoIzq, int hijoDer)
{
  int mayor = padre;
  if (array[mayor] < array[hijoIzq])
  {
    mayor = hijoIzq;
  }
  if (array[mayor] < array[hijoDer])
  {
    mayor = hijoDer;
  }
  return mayor;
}

void corregirCima(int *array, int pos, int array_size)
{
  int mayor = pos - 1;
  if (pos * 2 + 1 > array_size)
  {
    mayor = obtenerMaximo(array, pos - 1, (pos * 2) - 1, (pos * 2) - 1);
  }
  else
  {
    mayor = obtenerMaximo(array, pos - 1, ((pos * 2) - 1), (pos * 2));
  }

  if (mayor != pos - 1)
  {
    int temp = array[pos - 1];
    array[pos - 1] = array[mayor];
    array[mayor] = temp;
    if (mayor + 1 <= array_size / 2)
    {
      corregirCima(array, mayor + 1, array_size);
    }
  }
}

void monticularizar(int *array, int array_size)
{
  for (int i = array_size / 2; i > 0; i--)
  {
    corregirCima(array, i, array_size);
  }
}

/**
 * @brief The Heap Sort Algorithm.
 * 
 * @param array is the array that want to sort.
 * @param array_size is the numbers of elements in the array.
 */
void heap_sort(int *array, int array_size)
{
  monticularizar(array, array_size);
  for (int i = array_size - 1; i > 0; i--)
  {
    int temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    if (i > 1)
    {
      corregirCima(array, 1, i);
    }
  }
}

// -------------------------------- QUICK SORT ----------------------------------------

/**
 * @brief Funcion pivoteAleatorio
 * @details
 * La funci�n pivoteAletorio se encarga de generar una posici�n aleatoria
 * para un pivote que sera intercambiado con la ultima posici�n, esto para 
 * que la probabilidad de aparici�n del peor caso de complejidad sea muy baja.
 * Gracias a esta funci�n el algoritmo tiene complejidad nlog(n) en promedio
 * y su peor caso n^2 tiene muy bajas probabilidades de aparecer.
 * @param lista el arreglo a ordenar.
 * @param minimum_position la menor posici�n del arreglo.
 * @param maximum_position la mayor posici�n del arreglo.
 */
void pivoteAleatorio(int *lista, int minimum_position, int maximum_position)
{
  srand(time(NULL));
  int aleatorio = minimum_position + rand() % (maximum_position - minimum_position);
  std::swap(lista[aleatorio], lista[maximum_position]);
}

/**
 * @brief Funcion particion
 * @details
 *   Una vez generado el pivote, con el se encontraran todos los elementos 
 *   de la lista que sean menores o mayores que el pivote y se dividir�n en
 *   la izquierda los menores y a la derecha los mayores (esto lo realiza
 *   recorriendo el arreglo en ambas direcciones e intercambiando los valores
 *   que no cumplan lo anteriormente mencionado) para finalmente colocar 
 *   al pivote en medio de estos.
 * @param lista el arreglo a ordenar.
 * @param minimum_position la menor posici�n del arreglo.
 * @param maximum_position la mayor posici�n del arreglo.
 */
int particion(int *lista, int minimum_position, int maximum_position)
{
  pivoteAleatorio(lista, minimum_position, maximum_position);
  int izq = minimum_position;
  int der = maximum_position - 1;
  int pivote = lista[maximum_position];

  while (izq <= der)
  {
    while (izq <= der && lista[izq] <= pivote)
    {
      izq++;
    }

    while (izq <= der && lista[der] >= pivote)
    {
      der--;
    }

    if (izq <= der)
    {
      std::swap(lista[izq], lista[der]);
    }
  }
  std::swap(lista[izq], lista[maximum_position]);
  return izq;
}

/**
 * @brief Funcion quick_sort
 * 
 * @details
 * Primero divide el arreglo en dos y coloca el pivote en medio utilizando
 * la funci�n "particion" y luego utiliza "quick_sort" de forma recursiva con las
 * dos mitades divididas por el pivote, esto hasta que el arreglo se encuentre
 * ordenado.
 * @param lista el arreglo a ordenar.
 * @param array_size is the number of elements in the array.
 */
void quick_sortInner(int *lista, int minimum_position, int array_size)
{
  int maximum_position = array_size;
  if (maximum_position > minimum_position)
  {
    int pivote = particion(lista, minimum_position, maximum_position);
    quick_sortInner(lista, minimum_position, pivote - 1);
    quick_sortInner(lista, pivote + 1, maximum_position);
  }
}

void quick_sort(int *lista, int array_size)
{
  quick_sortInner(lista, 0, array_size - 1);
}
// -------------------------------- RADIX SORT ----------------------------------------

/**
 * @brief Get the maximum number of the array.
 * @param array is the array which to found the maximum.
 * @param array_size is the number of elements in the array. 
 * @return a element of the type of the template that was indicated. 
 */

template <typename data_type>
data_type getMax(data_type *array, int array_size)
{
  data_type maximum_number = array[0];
  for (int i = 1; i < array_size; i++)
  {
    if (array[i] > maximum_number)
    {
      maximum_number = array[i];
    }
  }
  return maximum_number;
}

/**
 * @brief Implements the counting sort for only for a specific digit of the number.
 * @details An auxiliar array is used for sorting the specific digits.
 * @param array is the original array which want to sort.
 * @param blocks_cant it is the number of blocks that I will need for the auxiliar array.
 * @param exponent it is the exponent for each call of this method.
 */
template <typename data_type>
void counting_sort(data_type *array, int blocks_cant, int exponent)
{
  data_type auxiliar[blocks_cant];
  data_type counting[10] = {0}; // It is use to know the amout of times that the same digit repeats.
  int i = 0;

  // Find the number of times that a digit is present.
  for (i = 0; i < blocks_cant; i++)
  {
    counting[(array[i] / exponent) % 10]++;
  }

  // Change the counting position so it is in order with the auxiliar array.
  for (i = 1; i < 10; i++)
  {
    counting[i] += counting[i - 1];
  }

  // Build the auxiliar array
  for (i = blocks_cant - 1; i >= 0; i--)
  {
    auxiliar[counting[(array[i] / exponent) % 10] - 1] = array[i];
    counting[(array[i] / exponent) % 10]--;
  }

  // Copy the modified array into the original one so it's sorted according to the specific digit.
  for (i = 0; i < blocks_cant; i++)
  {
    array[i] = auxiliar[i];
  }
}

/**
 * @brief It is the main method of this sort algorithm.
 * @details This method does not return anything as it modified the array by references. As well note that the array is of a template which means there's no data types limitations.
 * @param array is the reference to first element of the array that we want to sort.
 * @param array_size is the number of elements in the array to be sorted.
 */
template <typename data_type>
void radix_sort(data_type *array, int array_size)
{
  int digits = sizeof(array) / sizeof(array[0]);
  // We find the maxmimum number to establish the amount of digits needed.
  data_type maximum = getMax(array, array_size);

  // Implement the radix sort algorithm by call counting for each exponent we are working on.
  for (int exp = 1; maximum / exp > 0; exp *= 10)
  {
    counting_sort(array, array_size, exp);
  }
}

// -------------------------------- COUNTING SORT ----------------------------------------

//metodo el cual devuelve el dato mayor dentro del arreglo
template <typename tipo>
tipo max(tipo *arreglo, int size)
{
  tipo max = arreglo[0];
  for (int i = 0; i < size; i++)
  {
    if (max > arreglo[i + 1])
    {
      max = max;
    }
    else
    {
      max = arreglo[i + 1];
    }
  }
  return max;
}

//metodo que realiza el algoritmo de counting_sort
template <typename tipo>
void counting_sort(tipo *arreglo, int size)
{
  tipo maximo = max(arreglo, size);
  tipo arregloAux[maximo + 1];
  tipo aux;

  for (int i = 0; i <= maximo; i++)
  {
    arregloAux[i] = 0;
  }
  //imprimirArreglo(arregloAux, 14);
  //cout<<endl;
  for (int i = 0; i < size; i++)
  {
    aux = arreglo[i];
    arregloAux[aux] = (arregloAux[aux] + 1);
  }
  //imprimirArreglo(arregloAux, 14);
  //cout<<endl;

  for (int i = 0; i < maximo; i++)
  {
    arregloAux[i + 1] = (arregloAux[i] + arregloAux[i + 1]);
  }
  //imprimirArreglo(arregloAux, 14);
  //cout<<endl;
  tipo *arregloOrdenado = new tipo[size];
  tipo index;
  tipo place;
  for (int i = 0; i < size; i++)
  {
    arregloOrdenado[i] = arreglo[i];
    arreglo[i] = 0;
  }
  //imprimirArreglo(arregloOrdenado, size);
  cout << endl;

  for (int i = 0; i < size; i++)
  {
    index = arregloOrdenado[i];
    place = arregloAux[index];
    arregloAux[index] = (arregloAux[index] - 1);
    arreglo[place - 1] = index;
    //imprimirArreglo(arreglo, size);
    //cout<<endl;
  }
  delete[] arregloOrdenado;
}

// -------------------------------- SHELL SORT ----------------------------------------

/**
 * @brief Algoritmo de Ordenamiento shell_sort
 * @details
 *    El algoritmo shell_sort es una optimizaci�n a InsertionSort. 
 *    Es realizar una serie de InsertionSorts con el valor de distancia
 *    cada vez menor, lo que deja el arreglo casi ordenado, antes que
 *    distancia sea igual a 1, lo que efect�a un insertion sort normal   
 *    que termina de ordenar el arreglo. Para entender las distancias,
 *    tomemos un arreglo como 7 2 10 1 3. Tiene tama�o 5, entonces,
 *    distancia = 5/2 = 2, esto se puede observar como ordenar el arreglo
 *    en dos columnas: 7 2, ordenar las columnas: 3 1, y leer el arreglo
 *                     10 1                       7 2
 *                     3                          10  
 *    resultante: 3 1 7 2 10. Luego distancia se reduce a distancia/2,
 *    lo que hace que distancia valga 1 y se ejecuta un insertion sort
 *    normal que es especialmente r�pido luego del orden parcial obtenido
 *    en la anterior iteraci�n, obteniendo el arreglo ordenado 1 3 2 7 10.
 *    Calcular la complejidad de este algoritmo es un problema abierto, ya que
 *    var�a dependiendo del arreglo con el que se empieze y la forma en que se
 *    particione distancia. Experimentalmente se ha comprobado que se ubica entre
 *    nlog(n) y n^2.
 * @param arreglo El arreglo a ordenar.                   
 * @param arreglo El tama�o del arreglo a ordenar.
*/
void shell_sort(int *arreglo, int n)
{
  int distancia;
  for (distancia = n / 2; distancia > 0; distancia = distancia / 2)
  {
    for (int i = distancia; i < n; i++)
    {
      for (int j = i; j >= distancia; j = j - distancia)
      { /*insertion sort modificado*/
        if (arreglo[j - 1] > arreglo[j])
        {
          int temp = arreglo[j - 1];
          arreglo[j - 1] = arreglo[j];
          arreglo[j] = temp;
        }
      }
    }
  }
}
/**
 * @brief Algoritmo de Ordenamiento shell_sort_especial
 * @details
 *    El algoritmo shell_sort, con una modificación que reduce la complejidad considerablemente a n^(3/2).
 *    En vez de dividir el arreglo entre 2, se usan los numeros que cumplen la forma (3^k-1)/2,
 *    para ello decimos n=(3^k-1)/2 y al despejar k obtenemos k = log3(2*n+1) 
 *    Empezamos en este k hasta que k=0.
 *    Esta versión fue propuesta por Donald Knuth.
 *    log3 (2*n+1) = log(2*n+1)/log(3)
 * @param arreglo El arreglo a ordenar.                   
 * @param arreglo El tama�o del arreglo a ordenar.
*/
void shell_sort_especial(int *arreglo, int n)
{

  int indice = log(2 * n + 1) / log(3);
  int distancia = (pow(3, indice) - 1) / 2;
  for (indice; indice > 0; indice--)
  {
    int distancia = (pow(3, indice) - 1) / 2;
    for (int i = distancia; i < n; i++)
    {
      for (int j = i; j >= distancia; j = j - distancia)
      { /*insertion sort modificado*/
        if (arreglo[j - 1] > arreglo[j])
        {
          int temp = arreglo[j - 1];
          arreglo[j - 1] = arreglo[j];
          arreglo[j] = temp;
        }
      }
    }
  }
}
