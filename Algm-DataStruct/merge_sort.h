#ifndef MERGE_SORT_H
#define MERGE_SORT_H

/**
 * @brief This is subroutine from merge_sort
 * @details It mixes an array receive according to the merge algortihm.
 * @param array is the array that need to mix.
 * @param minimum_position is the below position from where to mix.
 * @param half_position is the half point between the minimum and the maximum. 
 * @param maximum_position is the top position to mix.
 */
template <typename data_type> void ordenar(data_type *lista, int min, int mit, int max) {
  int i = 0;
  data_type *lisAux = new int[max - min + 1];
  for (int j = 0; j < max - min + 1; j++) {
    lisAux[j] = 0;
  }

  int nuevoMin = min;
  int nuevoMit = mit + 1;
  while (nuevoMin <= mit && nuevoMit <= max) {
    if (lista[nuevoMin] < lista[nuevoMit]) {
      lisAux[i] = lista[nuevoMin];
      nuevoMin++;
      i++;
    }
    else {
      lisAux[i] = lista[nuevoMit];
      nuevoMit++;
      i++;
    }
  }

  while (nuevoMin <= mit) {
    lisAux[i] = lista[nuevoMin];
    i++;
    nuevoMin++;
  }

  while (nuevoMit <= max) {
    lisAux[i] = lista[nuevoMit];
    i++;
    nuevoMit++;
  }

  for (int j = min; j <= max; j++) {
    lista[j] = lisAux[j - min];
  }
  delete[] lisAux; // Clean memory.
}

/**
 * @brief The Merge Sort Algorithm.
 * @param array is the array that want to sort.
 * @param array_size is the numbers of elements in the array.
 */
template <typename data_type> void mergeSortInner(data_type* lista, int min, int max) {
  int mit = (min + max) / 2;
  if (min < max) {
    mergeSortInner(lista, min, mit);
    mergeSortInner(lista, mit + 1, max);
    ordenar(lista, min, mit, max);
  }
}

/**
 * @brief Merge sort algorithm.
 * @tparam data_type 
 * @param lista 
 * @param array_size 
 * @details It has a time of T(n) = 2T(n/2) + θ(n). Its great disadvantage is that needs an auxiliar space of size n.
 */
template <typename data_type> void merge_sort(data_type *lista, int array_size) {
  mergeSortInner(lista, 0, array_size - 1);
}


#endif /* MERGE_SORT_H */