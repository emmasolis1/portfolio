#define NOMINMAX
#define min(a,b)            (((a) < (b)) ? (a) : (b))
#define max(a,b)            (((a) > (b)) ? (a) : (b))

#include <stdio.h>
#include <stdexcept>

class Avl_tree {
private:
  struct node {
    node* left;
    node* right;
    int data;
  };

  int32_t stored_elements;
  node* head;

  /**
   * @brief Calculates the height for the three.
   * @param my_node 
   * @return int 
   */
  int32_t calculate_height(node* my_node) {
    int32_t height = 0;
    if (my_node != NULL) {
      int32_t left_height = calculate_height(my_node->left);
      int32_t right_height = calculate_height(my_node->right);
      int32_t max_height = max(left_height, right_height);
      height = max_height++;
    }
    return height;
  }

  /**
   * @brief Calculates the height difference for a given sub tree.
   * @details Used in order to keep the rules of height.
   * @param my_node 
   * @return int 
   */
  int32_t calculate_difference(node* my_node) {
    int32_t left_height = calculate_height(my_node->left);
    int32_t right_height = calculate_height(my_node->right);
    int32_t b_factor = left_height - right_height;
    return b_factor;
  }

  /**
   * @brief It makes the rotation of the case 1. This rotation consist of making a simple rotation to the right.
   * @details This is caused because the left grandchild produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* left_left_rotation(node* my_node) {
    node* my_node_son;
    my_node_son = my_node->left;
    my_node->left = my_node_son->right;
    my_node->right = my_node;
    return my_node_son;
  }

  /**
   * @brief It makes the rotation of the case 1=2. This rotation consist of making a simple rotation to the left.
   * @details This is caused because the right grandchild produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* right_right_rotation(node* my_node) {
    node* my_node_son;
    my_node_son = my_node->right;
    my_node->right = my_node_son->left;
    my_node->left = my_node;
    return my_node_son;
  }
  
  /**
   * @brief It makes the rotation of the case 3. This rotation consist of making a simple rotation to the left and then a right rotation to the principal node.
   * @details This is caused because the right child from my left son produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* left_right_rotation(node* my_node) {
    node* my_node_son;
    my_node_son = my_node->left;
    my_node->left = right_right_rotation(my_node_son);
    return left_left_rotation(my_node);
  }
  
  /**
   * @brief It makes the rotation of the case 4. This rotation consist of making a simple rotation to the right and then a left rotation to the principal node.
   * @details This is caused because the left child from my right son produces a desbalance.
   * @param my_node 
   * @return node* 
   */
  node* right_left_rotation(node* my_node) {
    node* my_node_son;
    my_node_son = my_node->right;
    my_node->right = left_left_rotation(my_node_son);
    return right_right_rotation(my_node);
  }
  
  /**
   * @brief It balances the tree from a certain node.
   * @param my_node 
   * @return node* 
   */
  node* balance_tree(node* my_node) {
    int32_t balance_factor = calculate_difference(my_node);
    if (balance_factor > 1) {
      if (calculate_difference(my_node->left) > 0) {
        my_node = left_left_rotation(my_node);
      } else {
        my_node = left_right_rotation(my_node);
      }
    } else {
      if (balance_factor < -1) {
        if (calculate_difference(my_node->right) > 0) {
          my_node = right_left_rotation(my_node);
        } else {
          my_node = right_right_rotation(my_node);
        }
      }
    }
    return my_node;
  }

public:
  /**
   * @brief Construct a new red black tree object
   */
  Avl_tree() {
    head = NULL;
    stored_elements = 0;
  }

  /**
   * @brief Destroy the red black tree object
   */
  ~Avl_tree() {
    delete head;
  }

  /**
   * @brief Inserts a new element into the tree.
   * @param my_node 
   * @param key 
   * @param data 
   * @return node* 
   */
  node* insert(node* my_node, int data) {
  if (my_node == NULL) {
    my_node = new node;
    my_node->data = data;
    my_node->left = NULL;
    my_node->right = NULL;
    return my_node;
  } else{
    if (data < my_node->data) {
      my_node->left = insert(my_node->left, data);
      my_node = balance_tree(my_node);
    } else {
      if (data >= my_node->data) {
        my_node->right = insert(my_node->right, data);
        my_node = balance_tree(my_node);
      }
    }
  }
  stored_elements++;
  return my_node;
  }

  /**
   * @brief Get the number of elements stored in the tree.
   * @return int 
   */
  int32_t get_size() {
    return stored_elements;
  }

  int search(int data) {
    if (head == NULL) {
      return -1;
    } else {
      node *tmp = head;
      // Search for the Node to link.
      while (tmp->left != NULL && tmp->right!=NULL) {
        if (tmp->data == data) {
          break;
        } else {
          if (tmp->data < data) {
            tmp = tmp->left;
          } else {
            tmp = tmp->right;
          }
        }
      }
      int value;
      if (tmp == NULL) {
        value = -1;
      } else {
        if (tmp->data != data) {
          value = -1;
        } else {
          value = tmp->data;
        }
      }
      return value;
    }
  }

  node *get_root(){return head;}
};