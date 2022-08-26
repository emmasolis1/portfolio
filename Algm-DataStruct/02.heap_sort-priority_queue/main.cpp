  // Copyright 2021 Emmanuel CC-BY-4
  // Implementation of learned from the Heap Sort method.

#include <iostream>
#include "list.h" // List templates implementation.
using namespace::std;

/**
 @brief It is the solution for the heap sort problem.
 @remarks Use of templates to make it for any data type.
 */
template <typename data_type>
struct heap_sort_solution {
  
  /**
   @brief Using the heap sort algorithm sorts an array of any type of data.
   @param array is the vector to be sorted.
   @param array_size is the number of elements in the array.
   */
  static void heap_sort (data_type *array, int array_size) {
      // Starting building the heap.
    for (int i = array_size / 2 - 1; i >= 0; i--) {
      max_heapify(array, array_size, i);
    }
      // One by one extract an element from heap and put the last in the head.
    for (int i = array_size - 1; i > 0; i--) {
      data_type tmp = array[0];
      array[0] = array[i];
      array[i] = tmp;
      
        // Calls max_heapify for the reduced heap.
      max_heapify(array, i, 0);
    }
  }
  
  /**
   @brief Keeps the max-heap property that says that each root has to be greater than its childs.
   @param array is the vector that is in process of being sorted.
   @param array_size is the number of elements in the array.
   @param i is node which is also an index in the array.
   @remarks assumes that the binary trees rooted at LEFT (i) and RIGHT (i) are max- heaps, but that A[ i ] might be smaller than its children, therefore violates the max-heap property.
   */
  static void max_heapify (data_type *array, int array_size, int i) {
    int largest = i; // The largest is the root.
    int left_side = 2 * i + 1; // left = 2*i + 1
    int right_side = 2 * i + 2; // right = 2*i + 2
    
      // Case left child is greater than root.
    if (left_side < array_size && array[left_side] > array[largest])
      largest = left_side;
    
      // Case right child is greater than largest so far
    if (right_side < array_size && array[right_side] > array[largest])
      largest = right_side;
    
      // In case that the largest is not root.
    if (largest != i) {
      swap(array[i], array[largest]);
        // Call max_heapify for the new sub-tree.
      max_heapify(array, array_size, largest);
    }
  }
  
  /**
   @brief Prints the elements of an array of any type.
   @param array is the array to be printed.
   @param array_size is the size of the array.
   */
  static void print_data (data_type *array, int array_size) {
    for (int i=0; i<array_size; i++) {
      cout << array[i] <<endl;
    }
  }
  
};

int main(int argc, const char * argv[]) {
  float test1[7] = {32.0, 23.0, 85.0, 65.0, 55.0, 1001.0, 100.0};
  float test2[4] = {100.0, 105.0, 150.0, 200.0};
  float test3[8] = {900.0, 800.0, 700.0, 600.0, 500.0, 400.0, 300.0, 200.0};
  
  heap_sort_solution<float> heap_sort;
  heap_sort.print_data(test1, 7);
  heap_sort.heap_sort(test1, 7);
  printf("After sorted:\n");
  heap_sort.print_data(test1, 7);
  
  // Perdon no tuve tiempo de incluir pruebas para el item 2. :(
  
  return 0;
}
