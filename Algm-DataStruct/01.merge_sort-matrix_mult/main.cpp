//
//  main.cpp
//  Lab01
//
//  Created by Emmanuel on 4/26/21.
//

#include <iostream>
using namespace std;

// FIRST EXERCISE: template data type, Merge sort

/**
 @brief A template in order to sort an array of any type.
 @remarks Put as a structure to avoid repeating the same template twice. Its O = n*log_{2}^{n} because the ) of merge_arrays it's 5n and the merge it's log_{2}^{n}.
 */
template <class data_type>
struct merge_sort_solution {
  
  /**
   @brief It merge to arrays into one.
   @param array is the array where are going to be mixed.
   @param lower_size is the size of the left array to be mixed.
   @param middle_size is the size of the array of the middle where will be mixed.
   @param upper_size is the size of the right array to be mixed.
   @remarks To be very carefull with memory managing.
   */
  static void merge_arrays (data_type *array, size_t lower_size, size_t middle_size, size_t upper_size) {
    size_t i, j, k; // Index for the cycles, because they're use in all the non anidaded cycles.
    size_t left[middle_size-lower_size+1]; // Creates a sub-array to store elements in the left side of the 'array[]'
    size_t right[upper_size-middle_size]; // Creates a sub-array to store elements in the right side of the 'array[]'
    for (i = 0; i < middle_size-lower_size+1; i++) { //copying appropriate elements from array[] to left[]
      left[i] = array[lower_size + i];
    }
    for (j = 0; j < upper_size-middle_size; j++) { //copying appropriate elements from array[] to right[]
      right[j] = array[middle_size + 1 + j];
    }
    i = 0; // Initial index of the left[] sub_array.
    j = 0; // Initial index of the right[] sub_array.
    k = lower_size; // Initial index of merged array.
    for (k = lower_size; i < middle_size-lower_size+1 && j < upper_size-middle_size; k++) { // Sorts in ascending order.
      if (left[i] <= right[j]) {
        array[k] = left[i++]; // Stores the value of left[i] in array[k] if the former is smaller.
      } else {
        array[k] = right[j++]; //Stores value of right[j] in array[j] if the former is smaller.
      }
    }
    while (i < middle_size-lower_size+1) {
      array[k++] = left[i++]; //It copies back the remaining elements of left[] to array[].
    }
    while (j < upper_size-middle_size) {
      array[k++] = right[j++]; // It copies back the remaining elements of right[] to array[].
    }
  }
  
  /**
   @brief It is the recursive solution for the merge sort method.
   @param array is the array where are going to be mixed.
   @param lower_size is the size of the left array to be mixed.
   @param upper_size is the size of the right array to be mixed.
   @remarks To be very carefull with stopping condition if changed.
   */
  static void merge_sort (data_type *array, size_t lower_size, size_t upper_size) {
    size_t middle_size;
    if(lower_size < upper_size) {
      middle_size = lower_size+(upper_size-lower_size)/2;
      // Sort first and second arrays recursively.
      merge_sort(array, lower_size, middle_size);
      merge_sort(array, middle_size+1, upper_size);
      merge_arrays(array, lower_size, middle_size, upper_size);
    }
  }
  
  static void print_array (data_type *array, size_t size) {
    for (int i = 0; i<size; i++) {
      printf("%zu ", array[i]);
    }
    printf("\n");
  }
};

// SECOND EXERCISE: matrix multiplier.
/**
 @brief Multiply two matrix of floats, assumes that the sizes are correct. Remember that there is no commutative property on matrix multiplication.
 @param input01 is the first matrix to be multiply.
 @param input02 is the second matrix to be multiply.
 @param output is the matrix where the result of the multiplication is going to be.
 @param n is the number of rows of the first matrix, also the number of rows of the result matrix.
 @param m is the number of colums of the first matrix and also the number rows of the second matrix.
 @param p is the number of colums of the second matrix, also the number of colums of the result matrix.
 @remarks Its O = n^3 because of the three anidated cycles.
 */
void multiplyMatrix (float **input01, float **input02, float **output, int n, int m, int p);

// THIRD EXERCISE: sudoku solver.

/**
 @brief It is a template to print a matrix of any type.
 @param matrix is the matrix to be print.
 @param amount_row the number of rows in the matrix.
 @param amount_column the number of columns in the matrix.
 @remarks It has a O = n^{6} because of the recursive calls.
 */
template <class matrix_type>
void print_matrix (matrix_type** matrix, int amount_row, int amount_column) {
  printf("\n");
  for (int i=0; i<amount_row; i++) {
    for (int j=0; j<amount_column; j++) {
      printf("%zu", matrix[i][j]);
    }
  }
}

/**
 @brief It is the algorithm to solve a sudoku game.
 @param matrix is the sudoku board.
 @return a boolean to know if the game have had a solution or not.
 @remarks It is a recursive function.
 */
bool solve_sudoku(int **matrix);

/**
 @brief Function to know if according to sudoko's rules a number can be place in a position.
 @param matrix is the matrix where needs to verify.
 @param number is the number that want to know if can be placed.
 @param row_position is the row where wants to place the number.
 @param column_position is the column where wants to place the number.
 @return a simple boolean, true is that the number can be place, else can not be placed.
 */
bool verify_valid_number_sudoku (int **matrix, int number, int row_position, int column_position);

/**
 @brief To know if a position in the game is empty, that happens when it is zero.
 @param row_position is the row of the matrix.
 @param column_position is the column of the matrix.
 @return a boolean, true the position is empty, false otherwise.
 */
bool is_empty_position (int **matrix, int &row_position, int &column_position);

/**
 @brief Function to know if according to sudoko's rules a number can be place in a cuadrant.
 @param matrix is the matrix where needs to verify.
 @param number is the number that want to know if can be placed.
 @param start_row_position is the row where wants to place the number.
 @param start_column_position is the column where wants to place the number.
 @return a simple boolean, true is that the number can be place, else can not be placed.
 */
bool verify_valid_number_cuadrant (int **matrix, int number, int start_row_position, int start_column_position);

int main(int argc, const char * argv[]) {
  // Prueba segundo ejercicio.
  /*int test_array[11] = {34, 12, 32, 12,54, 454, 6545, 4564, 34, 23, 546};
  cout << "Array before merge sor: ";
  merge_sort_solution<int>::print_array(test_array, 11);
  merge_sort_solution<int>::merge_sort(test_array, 0, 11-1);     //(n-1) for last index
  cout << "Array after merge sort: ";
  merge_sort_solution<int>::print_array(test_array, 11);*/
  
  printf("No pude agregarle los casos de prueba para todos los ejercicios, disculpe.");
  
  return 0;
}

void multiplyMatrix(float **input01, float **input02, float **output, int n, int m, int p) {
  for (int i=0; i<m; i++) {
    for (int j=0; j<p; j++) {
      for (int k=0; k<m; k++){
        output[i][j] += input01[i][k] * input02[k][j];
      }
    }
  }
}

bool solve_sudoku(int **matrix){
  int row_position, column_position;
  if (!is_empty_position(matrix, row_position, column_position))
    return true; // It stops when all places are fill.
  for (int possible_number = 1; possible_number <= 9; possible_number++) {
    if (verify_valid_number_sudoku(matrix, row_position, column_position, possible_number)){ // Reviews if the number is valid.
      matrix[row_position][column_position] = possible_number;
      if (solve_sudoku(matrix)) // It moves to find another empty space.
        return true;
      matrix[row_position][column_position] = 0; // Makes empty a space if is not valid.
    }
  }
  return false;
}

bool verify_valid_number_sudoku (int **matrix, int number, int row_position, int column_position) {
  bool valid = true; // Try to prove that it is invalid.
  //Verify for the right side.
  if (column_position!=8) { // To control a posible overflow.
    for (int i = column_position+1; i < 9; i++) {
      if (matrix[row_position][i] == number) {
        valid = false;
        break;
      }
    }
  }
  //Verify for the left side.
  if (valid == true) { // Do it only if still is a valid number.
    if (column_position != 0) {
      for (int i = column_position-1; i==0; i--) {
        if (matrix[row_position][i] == number) {
          valid = false;
          break;
        }
      }
    }
  }
  //Verify for the lower side.
  if (valid == true) {
    if (row_position!=8) { // To control a posible overflow.
      for (int i = row_position+1; i < 9; i++) {
        if (matrix[i][column_position] == number) {
          valid = false;
          break;
        }
      }
    }
  }
  //Verify for the upper side.
  if (valid == true) { // Do it only if still is a valid number.
    if (row_position != 0) {
      for (int i = row_position-1; i==0; i--) {
        if (matrix[i][column_position] == number) {
          valid = false;
          break;
        }
      }
    }
  }
  //Verifies in the cuadrant.
  valid = verify_valid_number_cuadrant(matrix, number, row_position - row_position % 3, column_position - column_position % 3);
  return valid;
}

bool verify_valid_number_cuadrant (int **matrix, int number, int start_row_position, int start_column_position) {
  bool valid = false; // Asumme to be non valid number.
  for (int row_position = 0; row_position < 3; row_position++) {
    for (int column = 0; column < 3; column++) {
      if (matrix[row_position+start_row_position][column+start_column_position] == number) {
        valid = true;
      }
    }
  }
  return valid;
}

bool is_empty_position (int **matrix, int &row_position, int &column_position) { //get empty location and update row and column
  for (row_position = 0; row_position < 9; row_position++)
    for (column_position = 0; column_position < 9; column_position++)
      if (matrix[row_position][column_position] == 0)
        return true;
  return false;
}
