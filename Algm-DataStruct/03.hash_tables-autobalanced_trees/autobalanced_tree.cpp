#include <stdio.h>
#include <stdexcept>
#include "autobalanced_tree.h"

template <typename key_type, typename data_type>
Avl_tree<key_type, data_type>::Avl_tree() {
  head = NULL;
  stored_elements = 0;
}

template <typename key_type, typename data_type>
Avl_tree<key_type, data_type>::~Avl_tree() {
  delete head;
}

template <typename key_type, typename data_type>
const data_type& Avl_tree<key_type, data_type>::at(const key_type &key) {
  node* current = head;
  data_type data = NULL;
  // Searching the element.
  while(current.left != NULL && current.right != NULL) {
    if (current.key == key) {
      data = current.data;
      break;
    } else {
      if (current.key < key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
  }
  // Bear out if the element exits or not.
  if (current.key != key) {
    throw std::out_of_range;
  }
  return data;
}

template <typename key_type, typename data_type>
data_type& Avl_tree<key_type, data_type>::operator[](const key_type &key) {
  data_type* reference = NULL;
  try {
    reference = &at(key);
  } catch(const std::out_of_range& error) {
    // Insert and balance the tree.
    node* new_node = new node;
    insert(new_node, key, NULL);
    return &new_node;
  }
}

template <typename key_type, typename data_type>
int32_t Avl_tree<key_type, data_type>::get_size() {return stored_elements;}

// ------------------- Private Methods --------------------

template <typename key_type, typename data_type>
int32_t Avl_tree<key_type, data_type>::calculate_height(node* my_node) {
  int32_t height = 0;
  if (my_node != NULL) {
    int32_t left_height = calculate_height(my_node.left);
    int32_t right_height = calculate_height(my_node.right);
    int32_t max_height = std:::max(left_height, right_height);
    height = max_height++;
  }
  return height;
}

template <typename key_type, typename data_type>
int32_t Avl_tree<key_type, data_type>::calculate_difference(node* my_node) {
  int32_t left_height = height(my_node.left);
  int32_t right_height = height(my_node.right);
  int32_t b_factor = left_height - right_height;
  return b_factor;
}

template <typename key_type, typename data_type>
node* Avl_tree<key_type, data_type>::left_left_rotation(node* my_node) {
  node* my_node_son;
  my_node_son = my_node.left;
  my_node.left = my_node_son.right;
  my_node.right = my_node;
  return my_node_son;
}

template <typename key_type, typename data_type>
node* Avl_tree<key_type, data_type>::right_right_rotation(node* my_node) {
  node* my_node_son;
  my_node_son = my_node.right;
  my_node.right = my_node_son.left;
  my_node.left = my_node;
  return my_node_son;
}

template <typename key_type, typename data_type>
node* Avl_tree<key_type, data_type>::left_right_rotation(node* my_node) {
  node* my_node_son;
  my_node_son = my_node.left;
  my_node.left = right_right_rotation(my_node_son);
  return left_left_rotation(my_node);
}
  
template <typename key_type, typename data_type>
node* Avl_tree<key_type, data_type>::right_left_rotat(node* my_node) {
  node* my_node_son;
  my_node_son = my_node.right;
  my_node.right = left_left_rotation(my_node_son);
  return right_right_rotation(my_node);
}

template <typename key_type, typename data_type>
node* Avl_tree<key_type, data_type>::balance_tree(node* my_node) {
  int32_t balance_factor = calculate_difference(my_node);
  if (balance_factor > 1) {
    if (calulate_difference(my_node.left) > 0) {
      my_node = left_left_rotation(my_node);
    } else {
      my_node = left_right_rotation(my_node);
    }
  } else {
    if (balance_factor < -1) {
      if (calculate_difference(my_node.right) > 0) {
        my_node = right_left_rotat(my_node);
      } else {
        my_node = right_right_rotation(my_node);
      }
    }
  }
  return my_node;
}

template <typename key_type, typename data_type>
node* Avl_tree<key_type, data_type>::insert(node* my_node, key_type key, data_type data) {
  if (my_node == NULL) {
    my_node = new node;
    my_node.key = key;
    my_node.data = data;
    my_node.left = NULL;
    my_node.right = NULL;
    return my_node;
  } else{
    if (key < my_node.key) {
      my_node.left = insert(my_node.left, key, data);
      my_node = balance_tree(my_node);
    } else {
      if (key >= my_node.key) {
        my_node->my_node = insert(my_node.right, key, data);
        my_node = balance_tree(my_node);
      }
    }
  }
  return my_node;
}