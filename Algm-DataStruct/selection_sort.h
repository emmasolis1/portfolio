#ifndef SELECTION_SORT_H
#define SELECTION_SORT_H

/**
 * @brief Selection Sort Algorithm.
 * @param array array you want to sort.
 * @param array_size numbers of elements in the array.
 * @details modifies the data by address so does not return anything.
 */
template <typename data_type> void selection_sort (data_type* array, int array_size) {
  for (int i=0; i<array_size; i++) {
    int minimum_position = i;
    data_type minimum_data = array[i];
    for (int j = i+1; j < array_size; j++) {
      if (array[j] < minimum_data) {
        minimum_data = array[j];
        minimum_position = j;
      }
    }
    array[minimum_position] = array[i];
    array[i] = minimum_data;
  }
} 

#endif /* SELECTION_SORT_H */