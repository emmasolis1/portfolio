#ifndef INSERTION_SORT_H
#define INSERTION_SORT_H

/**
 * @brief Insertion Sort Algorithm.
 * @param array array you want to sort.
 * @param array_size numbers of elements in the array.
 * @details Takes a time of O(n^2).
 */
template <typename data_type> void insertion_sort(data_type* array, int array_size) {
  for (int i=0; i<array_size; i++) {
    for (int j=i; j>0; j--) {
      if (array[j-1] > array [j]) {
        data_type temp = array[j-1];
        array[j-1] = array[j];
        array[j] = temp;
      }
    }
  }
}

#endif /* INSERTION_SORT_H */
