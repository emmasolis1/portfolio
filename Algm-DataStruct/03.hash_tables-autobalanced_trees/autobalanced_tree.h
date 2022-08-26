// Choosed autobalanced tree: avl tree.

#ifndef AUTOBALANCED_TREE_H
#define AUTOBALANCED_TREE_H

template <typename key_type, typename data_type>
class Avl_tree {
private:
  struct node {
    node* left;
    node* right;
    key_type key;
    data_type data;
  };

  int32_t stored_elements;
  node* head;

  /**
   * @brief Calculates the height for the three.
   * @param my_node 
   * @return int 
   */
  int32_t calculate_height(node* my_node = head);

  /**
   * @brief Calculates the height difference for a given sub tree.
   * @details Used in order to keep the rules of height.
   * @param my_node 
   * @return int 
   */
  int32_t calculate_difference(node* my_node);

  /**
   * @brief It makes the rotation of the case 1. This rotation consist of making a simple rotation to the right.
   * @details This is caused because the left grandchild produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* left_left_rotation(node* my_node);

  /**
   * @brief It makes the rotation of the case 1=2. This rotation consist of making a simple rotation to the left.
   * @details This is caused because the right grandchild produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* right_right_rotation(node* my_node);
  
  /**
   * @brief It makes the rotation of the case 3. This rotation consist of making a simple rotation to the left and then a right rotation to the principal node.
   * @details This is caused because the right child from my left son produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* left_right_rotation(node* my_node);
  
  /**
   * @brief It makes the rotation of the case 4. This rotation consist of making a simple rotation to the right and then a left rotation to the principal node.
   * @details This is caused because the left child from my right son produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* right_left_rotation(node* my_node);
  
  /**
   * @brief It balances the tree from a certain node.
   * @param my_node 
   * @return node* 
   */
  node* balance_tree(node* my_node);
  
  /**
   * @brief Inserts a new element into the tree.
   * @param my_node 
   * @param key 
   * @param data 
   * @return node* 
   */
  node* insert(node* my_node, key_type key, data_type data);

public:
  /**
   * @brief Construct a new red black tree object
   */
  Avl_tree();

  /**
   * @brief Destroy the red black tree object
   */
  ~Avl_tree();

  /**
   * @brief Returns the data_type object stored for the key_type key.
   * @details in case of not founding the object it must throw the exception std::out_of_range.
   * @param key 
   * @return const data_type& 
   */
  const data_type& at(const key_type &key);

  /**
   * @brief Returns the data_type object stored in the tree for the choosed key.
   * @details in case of not founding the key then insert the new key in the tree, balance it and then return it.
   * @param key 
   * @return data_type& 
   */
  data_type& operator[](const key_type &key);

  /**
   * @brief Get the number of elements stored in the tree.
   * @return int 
   */
  int32_t get_size();
};
#endif /* AUTOBALANCED_TREE_H */