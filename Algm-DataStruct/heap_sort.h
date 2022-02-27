#ifndef HEAP_SORT_H
#define HEAP_SORT_H


template <typename data_type> data_type obtenerMaximo (data_type* array,
  int padre, int hijoIzq, int hijoDer) {
  int mayor = padre;
  if (array[mayor]<array[hijoIzq]) {
    mayor = hijoIzq;
  }
  if (array[mayor] < array[hijoDer]) {
    mayor = hijoDer;
  }
  return mayor;
}

template <typename data_type> void corregirCima(data_type* array, int pos,
  int array_size) {
  int mayor = pos - 1;
  if (pos * 2 + 1 > array_size) {
    mayor = obtenerMaximo(array, pos - 1, (pos * 2) - 1, (pos * 2) - 1);
  }
  else {
    mayor = obtenerMaximo(array, pos - 1, ((pos * 2) - 1), (pos * 2));
  }
  if (mayor != pos - 1) {
    data_type temp = array[pos - 1];
    array[pos - 1] = array[mayor];
    array[mayor] = temp;
    if (mayor + 1 <= array_size / 2) {
      corregirCima(array, mayor + 1, array_size);
    }
  }
}

template <typename data_type> void monticularizar(int* array, int array_size) {
  for (int i = array_size / 2; i > 0; i--) {
    corregirCima(array, i, array_size);
  }
}

/**
 * @brief Heap sort algorithm.
 * @param array 
 * @param array_size 
 * @details Because heapify has O(log(n)), Heap Sort has a duration of O(n*log(n)). Mostly use to sort an almost sorted array or to find the smallest or largest element in an array.
 */
template <typename data_type> void heap_sort (data_type* array, int array_size) {
  monticularizar(array, array_size);
  for (int i = array_size - 1; i > 0; i--) {
    data_type temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    if (i > 1) {
      corregirCima(array, 1, i);
    }
  }
}


#endif /* HEAP_SORT_H */