#include <stdio.h>
#include <string>
#include "hash_table.h"

template <typename data_type>
Hash_table<data_type>::Hash_table() {
  my_hash_table = NULL;
  stored_elements = 0;
}

template <typename data_type>
Hash_table<data_type>::~Hash_table() {
  delete my_hash_table;
}

template <typename data_type>
int32_t Hash_table<data_type>::get_size() {return stored_elements;}

template <typename data_type>
data_type Hash_table<data_type>::get_data(std::string key) {
  table* my_table = find_by_key(key);
  return my_table->data;
}

template <typename data_type>
void Hash_table<data_type>::insert(std::string key, data_type data) {
  table* my_table = find_by_key(key);
  // Insertar nuevo elemento en la tabla.
}