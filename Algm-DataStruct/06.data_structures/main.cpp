// Needed libraries.
#include <iostream>
#include <cstdlib>
#include <chrono>
#include <stdio.h>
#include <fstream>
// Solution files.
#include "linked_list.cpp"
#include "binary_tree.cpp"
#include "balanced_tree.cpp"
#include "hash_table.cpp"

using namespace std;

void make_test_list(int cant_numeros) {
  double **times_unsorted = new double*[3]; 
  double **times_sorted = new double*[3];
  double **average_times = new double*[2];
  average_times[0] = new double[3];
  average_times[1] = new double[3];

  for (int i=0; i<3; i++) {
    times_unsorted[i] = new double[3];
    times_sorted[i] = new double[3];
  }

  // Unsorted elements.
  for (int t=0 ; t<3; t++) {
    Linked_list *tree_unsorted = new Linked_list();

    // Insert unsorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_unsorted->insert(number);
    }
    times_unsorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_unsorted->search(number);
    }
    times_unsorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Delete elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      tree_unsorted->delete_element(number);
    }
    times_unsorted[2][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    tree_unsorted->~Linked_list();

  }

  // Sorted elements.
  for(int t=0 ; t<3; t++) {
    Linked_list *tree_sorted = new Linked_list();

    // Insert sorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    for (int i=0; i<cant_numeros; i++) {
      tree_sorted->insert(i);
    }
    times_sorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_sorted->search(number);
    }
    times_sorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Delete elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      tree_sorted->delete_element(number);
    }
    times_sorted[2][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    tree_sorted->~Linked_list();
  }

  // Assign the unsorted times. 0. Insert; 1. Search; 2. Delete.
  average_times[0][0] = (times_unsorted[0][0] + times_unsorted[0][1] + times_unsorted[0][2]) / 3;
  average_times[0][1] = (times_unsorted[1][0] + times_unsorted[1][1] + times_unsorted[1][2]) / 3;
  average_times[0][2] = (times_unsorted[2][0] + times_unsorted[2][1] + times_unsorted[2][2]) / 3;
  average_times[1][0] = (times_sorted[0][0] + times_sorted[0][1] + times_sorted[0][2]) / 3;
  average_times[1][1] = (times_sorted[1][0] + times_sorted[1][1] + times_sorted[1][2]) / 3;
  average_times[1][2] = (times_sorted[2][0] + times_sorted[2][1] + times_sorted[2][2]) / 3;
  std::cout << cant_numeros <<endl;
  std::cout << "-Random Numbers:" <<endl;
  std::cout << "Insert:" << average_times[0][0] <<endl;
  std::cout << "Search:" << average_times[0][1] <<endl;
  std::cout << "Delete:" << average_times[0][2] <<endl;
  std::cout << "-Sorted Numbers:" <<endl;
  std::cout << "Insert:" << average_times[1][0] <<endl;
  std::cout << "Search:" << average_times[1][1] <<endl;
  std::cout << "Delete:" << average_times[1][2] <<endl;
}

void make_test_binary_tree(int cant_numeros) {
  double **times_unsorted = new double*[3]; 
  double **times_sorted = new double*[3];
  double **average_times = new double*[2];
  average_times[0] = new double[3];
  average_times[1] = new double[3];

  for (int i=0; i<3; i++) {
    times_unsorted[i] = new double[3];
    times_sorted[i] = new double[3];
  }

  // Unsorted elements.
  for (int t=0 ; t<3; t++) {
    Binary_tree *tree_unsorted = new Binary_tree();

    // Insert unsorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_unsorted->insert(number);
    }
    times_unsorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_unsorted->search(number);
    }
    times_unsorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Delete elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      tree_unsorted->delete_element(tree_unsorted->get_root(), number);
    }
    times_unsorted[2][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    tree_unsorted->~Binary_tree();

  }

  // Sorted elements.
  for(int t=0 ; t<3; t++) {
    Binary_tree *tree_sorted = new Binary_tree();

    // Insert sorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    for (int i=0; i<cant_numeros; i++) {
      tree_sorted->insert(i);
    }
    times_sorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_sorted->search(number);
    }
    times_sorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Delete elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      tree_sorted->delete_element(tree_sorted->get_root(), number);
    }
    times_sorted[2][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    tree_sorted->~Binary_tree();
  }

  // Assign the unsorted times. 0. Insert; 1. Search; 2. Delete.
  average_times[0][0] = (times_unsorted[0][0] + times_unsorted[0][1] + times_unsorted[0][2]) / 3;
  average_times[0][1] = (times_unsorted[1][0] + times_unsorted[1][1] + times_unsorted[1][2]) / 3;
  average_times[0][2] = (times_unsorted[2][0] + times_unsorted[2][1] + times_unsorted[2][2]) / 3;
  average_times[1][0] = (times_sorted[0][0] + times_sorted[0][1] + times_sorted[0][2]) / 3;
  average_times[1][1] = (times_sorted[1][0] + times_sorted[1][1] + times_sorted[1][2]) / 3;
  average_times[1][2] = (times_sorted[2][0] + times_sorted[2][1] + times_sorted[2][2]) / 3;
  std::cout << cant_numeros <<endl;
  std::cout << "-Random Numbers:" <<endl;
  std::cout << "Insert:" << average_times[0][0] <<endl;
  std::cout << "Search:" << average_times[0][1] <<endl;
  std::cout << "Delete:" << average_times[0][2] <<endl;
  std::cout << "-Sorted Numbers:" <<endl;
  std::cout << "Insert:" << average_times[1][0] <<endl;
  std::cout << "Search:" << average_times[1][1] <<endl;
  std::cout << "Delete:" << average_times[1][2] <<endl;
}

void make_test_avl_tree(int cant_numeros) {
  double **times_unsorted = new double*[2]; 
  double **times_sorted = new double*[2];
  double **average_times = new double*[2];

  for (int i=0; i<2; i++) {
    times_unsorted[i] = new double[3];
    times_sorted[i] = new double[3];
    average_times[i] = new double[3];
  }

  // Unsorted elements.
  for (int t=0 ; t<3; t++) {
    Avl_tree *tree_unsorted = new Avl_tree();

    // Insert unsorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_unsorted->insert(tree_unsorted->get_root(), number);
    }
    times_unsorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_unsorted->search(number);
    }
    times_unsorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    tree_unsorted->~Avl_tree();

  }

  // Sorted elements.
  for(int t=0 ; t<3; t++) {
    Avl_tree *tree_sorted = new Avl_tree();

    // Insert sorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    for (int i=0; i<cant_numeros; i++) {
      tree_sorted->insert(tree_sorted->get_root(), i);
    }
    times_sorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      tree_sorted->search(number);
    }
    times_sorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    tree_sorted->~Avl_tree();
  }

  // Assign the unsorted times. 0. Insert; 1. Search; 2. Delete.
  average_times[0][0] = (times_unsorted[0][0] + times_unsorted[0][1] + times_unsorted[0][2]) / 3;
  average_times[0][1] = (times_unsorted[1][0] + times_unsorted[1][1] + times_unsorted[1][2]) / 3;
  average_times[1][0] = (times_sorted[0][0] + times_sorted[0][1] + times_sorted[0][2]) / 3;
  average_times[1][1] = (times_sorted[1][0] + times_sorted[1][1] + times_sorted[1][2]) / 3;
  std::cout << cant_numeros <<endl;
  std::cout << "-Random Numbers:" <<endl;
  std::cout << "Insert:" << average_times[0][0] <<endl;
  std::cout << "Search:" << average_times[0][1] <<endl;
  std::cout << "-Sorted Numbers:" <<endl;
  std::cout << "Insert:" << average_times[1][0] <<endl;
  std::cout << "Search:" << average_times[1][1] <<endl;
}

void make_test_hash_table(int cant_numeros) {
  double **times_unsorted = new double*[2]; 
  double **times_sorted = new double*[2];
  double **average_times = new double*[2];

  for (int i=0; i<2; i++) {
    times_unsorted[i] = new double[3];
    times_sorted[i] = new double[3];
    average_times[i] = new double[3];
  }

  // Unsorted elements.
  for (int t=0 ; t<3; t++) {
    Hash_table *hash_unsorted = new Hash_table(cant_numeros);

    // Insert unsorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      hash_unsorted->insert(number);
    }
    times_unsorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      hash_unsorted->search(number);
    }
    times_unsorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    hash_unsorted->~Hash_table();

  }

  // Sorted elements.
  for(int t=0 ; t<3; t++) {
    Hash_table *hash_sorted = new Hash_table(cant_numeros);

    // Insert sorted elements on list.
    std::chrono::time_point<std::chrono::steady_clock> tStart =  std::chrono::steady_clock::now();
    for (int i=0; i<cant_numeros; i++) {
      hash_sorted->insert(i);
    }
    times_sorted[0][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    // Search elements.
    tStart =  std::chrono::steady_clock::now();
    int number = 0;
    for (int i=0; i<cant_numeros; i++) {
      number = rand()%(cant_numeros*2)+1;
      hash_sorted->search(number);
    }
    times_sorted[1][t] = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - tStart).count();

    hash_sorted->~Hash_table();
  }

  // Assign the unsorted times. 0. Insert; 1. Search; 2. Delete.
  average_times[0][0] = (times_unsorted[0][0] + times_unsorted[0][1] + times_unsorted[0][2]) / 3;
  average_times[0][1] = (times_unsorted[1][0] + times_unsorted[1][1] + times_unsorted[1][2]) / 3;
  average_times[1][0] = (times_sorted[0][0] + times_sorted[0][1] + times_sorted[0][2]) / 3;
  average_times[1][1] = (times_sorted[1][0] + times_sorted[1][1] + times_sorted[1][2]) / 3;
  std::cout << cant_numeros <<endl;
  std::cout << "-Random Numbers:" <<endl;
  std::cout << "Insert:" << average_times[0][0] <<endl;
  std::cout << "Search:" << average_times[0][1] <<endl;
  std::cout << "-Sorted Numbers:" <<endl;
  std::cout << "Insert:" << average_times[1][0] <<endl;
  std::cout << "Search:" << average_times[1][1] <<endl;
}

int main(void) {
  std::cout << "Linked List.\n" <<endl;
  /*make_test_list(131072);
  make_test_list(262144);
  make_test_list(524144);
  make_test_list(786432);
  make_test_list(1048572);*/

  std::cout << "Simple Binary Tree\n" <<endl;
  /*make_test_binary_tree(131072);
  make_test_binary_tree(262144);
  make_test_binary_tree(524144);
  make_test_binary_tree(786432);
  make_test_binary_tree(1048572);*/

  std::cout << "AVL Binary Tree\n" <<endl;
  /*make_test_avl_tree(131072);
  make_test_avl_tree(262144);
  make_test_avl_tree(524144);
  make_test_avl_tree(786432);
  make_test_avl_tree(1048572);*/

  std::cout << "Hash Table.\n" <<endl;
  /*make_test_hash_table(131072);
  make_test_hash_table(262144);
  make_test_hash_table(524144);
  make_test_hash_table(786432);
  make_test_hash_table(1048572);*/

  return 0;  
}