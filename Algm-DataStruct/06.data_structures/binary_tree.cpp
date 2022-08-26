#include <iostream>
#include <stdio.h>

class Binary_tree {
private:
  struct Node {
    Node *left;
    Node *right;
    int data;
  };
  Node *root;
public:
  Binary_tree(/* args */) {
    root = NULL;
  }

  ~Binary_tree() {
    delete root;
  }

  void insert(int data) {
    if (root == NULL) {
      root = new Node;
      root->data = data;
      root->left = NULL;
      root->right = NULL;
    } else {
      Node *tmp = root;
      // Search for the Node to link.
      while (tmp->left != NULL && tmp->right!=NULL) {
        if (tmp->data <= data) {
          tmp = tmp->left;
        } else {
          tmp = tmp->right;
        }
      }
      // Insert the element.
      if (tmp->data <= data) {
        tmp->left = new Node;
        tmp->left->right = NULL;
        tmp->left->data = data;
      } else {
        tmp->right = new Node;
        tmp->right->left = NULL;
        tmp->right->data = data;
      }
    }
  }

  int search(int data) {
    if (root != NULL) {
      Node *tmp = root;
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
    return tmp->data;
    } else {
      return -1;
    }
  }

  // This method has been adapted from: https://www.goeduhub.com/8489/delete-an-element-from-a-binary-search-tree-in-c
  Node *delete_element(Node* root, int data) { 
    // Base case: the tree is empty.
    if (root == NULL) {
      return root;
    }
    // Case 1: In case the data deleted is smaller than the root.
    if (data < root->data) {
      root->left = delete_element(root->left, data); 
    } else {
      // Case 2: In case the data deleted is greater than the root.
      if (data > root->data) {
        root->right = delete_element(root->right, data); 
      } else {
        if (root->left == NULL) { 
          Node *temp = root->right; 
          delete[] root; 
          return temp; 
        } else {
          if (root->right == NULL) { 
          Node *temp = root->left; 
          delete[] root; 
          return temp; 
        }
      }
      // If the node has two children: Get the inorder successor (smallest in the right subtree).
      Node *leftest_right = root->right;
      /* loop down to find the leftmost leaf */
      while (leftest_right && leftest_right->left != NULL) {
        leftest_right = leftest_right->left; 
      }
      // Copy the inorder successor's content to this node 
      root->data = leftest_right->data; 
      // Delete the inorder successor 
      root->right = delete_element(root->right, leftest_right->data); 
      }
    }
    return root; 
  } 

  Node *get_root() {return root;}
};