#ifndef BUBBLE_SORT_H
#define BUBBLE_SORT_H

/**
 * @brief 
 * @tparam data_type as the object by reference to be sorted. 
 * @param array array you want to sort.
 * @param array_size numbers of elements in the array.
 * @details Average/Worst time: O(n^2). Best time: O(n). Advantages: it's only good if elements are already sorted, used to teach sorting algorithms. Disadvantajes: really slow.
 */
template<typename data_type> void bubble_sort(data_type* array, int array_size) {
  for (int i = 0; i < array_size-1; i++) {
    // Last i elements are already in place 
    for (int j = 0; j < array_size-i-1; j++) {
      if (array[j] > array[j+1]) {
        data_type tmp = array[j];
        array[j] = array[j+1];
        array[j+1] = tmp;
      }
    }
  }
}

#endif /* BUBBLE_SORT_H */
