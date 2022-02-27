#ifndef VECTOR_LIST_H
#define VECTOR_LIST_H

template<typename object_type>
class vector_list {
private:
  int current_size;
  int size_limit;
  object_type *vector;
public:
  vector_list (/* args */);                       // DONE
  vector_list (int array_size);                   // DONE
  ~vector_list( );                                // DONE
  object_type at(int index);                      // DONE
  void swap(object_type other_vector);            // DONE
  int capacity();                                 // DONE              
  int empty();                                    // DONE
  int erase(int index);                           // DONE
  void insert(object_type new_data, int index);   // DONE
  object_type pop();                              // DONE
  void push_back(object_type new_data);           // DONE  
  object_type operator[](int index);              // DONE
};

template<typename object_type>
vector_list<object_type>::vector_list(/* args */) {
  current_size = 0;
  size_limit = 256;
  vector = (object_type*) malloc(256 * sizeof(object_type));
  for(int index = 0; index < size_limit; ++index) {
    vector[index] = 0;
  }
}

template<typename object_type>
vector_list<object_type>::vector_list(int array_size) {
  current_size = 0;
  size_limit = array_size;
  vector = (object_type*) malloc(size_limit * sizeof(object_type));
  for(int index = 0; index < size_limit; ++index) {
    vector[index] = 0;
  }
}

template<typename object_type>
vector_list<object_type>::~vector_list() {
  free(vector);
}

template<typename object_type>
object_type vector_list<object_type>::at(int index) {
  return index >= size_limit ? nullptr : vector[index];
}

template<typename object_type>
void vector_list<object_type>::swap(object_type other_vector) {
  object_type *address_one = &vector[0];
  object_type *address_two = &other_vector[0];

  // Switch by CPU
  if(address_one != address_two) {
    vector ^= other_vector;
    other_vector ^= vector;
    vector ^= other_vector;
  }
}

template<typename object_type>
int vector_list<object_type>::capacity() {
  return size_limit;
}

template<typename object_type>
int vector_list<object_type>::empty() {
  int status = 0; // Asume to be empty, prove contrary.
  for(int index = 0; index < size_limit; ++index) {
    if(vector[index] != 0) {
      status = 1;
      break;
    }
  }
  return status;
}

template<typename object_type>
int vector_list<object_type>::erase(int index) {
  int status = 0;
  if(index >= size_limit) {
    status = 1;
    return status;
  } else {
    vector[index] = 0;
    return status;
  }
}

template<typename object_type>
void vector_list<object_type>::insert(object_type new_data, int index) {
  if(current_size == size_limit) {
    size_limit *= 1.5;
    vector = (object_type *) realloc(vector, size_limit * sizeof(object_type));
  }
  for(int my_index = current_size; my_index > index-1; --my_index) {
    vector[my_index] = vector[my_index-1];
  }
  vector[index] = new_data;
  current_size++;
}

template<typename object_type>
object_type vector_list<object_type>::pop() {
  object_type object = vector[0];
  for(int index = 1; index < size_limit; ++index) {
    vector[index-1] = vector[index];
  }
  return object;
}

template<typename object_type>
void vector_list<object_type>::push_back(object_type new_data) {
  if(current_size >= size_limit) {
    size_limit *= 1.5;
    vector = (object_type *) realloc(vector, size_limit * sizeof(object_type));
  }
  vector[current_size] = new_data;
  ++current_size;
}

template<typename object_type>
object_type vector_list<object_type>::operator[](int index) {
  return vector[index];
}

#endif /* VECTOR_LIST_H */