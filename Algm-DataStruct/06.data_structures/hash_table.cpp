#include <stdio.h>
#include <stdexcept>

class Hash_table {
private:
  int* table;
  int capacity;
  int stored_elements;

  int hash(int data) {
    int index = data % capacity;
    while (table[index] == -1) { // Means that occupied.
      index++;
    }
    return index;
  }
public:
  Hash_table(int my_capacity) {
    capacity = my_capacity;
    stored_elements = 0;
    table = new int[capacity];
    for (int i = 0; i < capacity; i++) {
      table[i] = -1;
    }
    
  }
  ~Hash_table() {
    delete[] table;
  }

  void insert(int new_data) {
    if (stored_elements < capacity) {
      table[hash(new_data)] = new_data;
    }
  }

  int search(int my_data) {
    int index = hash(my_data);
    if (table[index] != my_data) {
      return -1;
    } else {
      return my_data;
    }
  }
};
