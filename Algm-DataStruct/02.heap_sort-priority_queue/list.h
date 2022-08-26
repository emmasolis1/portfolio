//
//  list.h
//  Lab02
//
//  Created by Emmanuel Solis on 5/15/21.
//

#ifndef list_h
#define list_h

template <typename data_type> // Data type for the Queue.
class Priority_Queue {
  //Here's all the Node's information.
private:
  class Node {
  private:
    data_type my_data;
    Node* my_next_node;
    int my_key_value;
    
  public:
    Node (data_type data, Node* next_node, int key_value) {
      my_data = data;
      my_next_node = next_node;
      my_key_value = key_value;
    }
      // SETTERS
    void set_my_data (data_type data) {my_data=data;}
    void set_my_next_node (Node* next_node) {my_next_node=next_node;}
    void set_my_key_value (int new_key) {
      if (new_key > my_key_value) {
        my_key_value = new_key;
      }
    }
      // GETTERS
    data_type get_my_data () {return my_data;}
    Node* get_next_node () {return my_next_node;}
    int get_my_key_value () {return my_key_value;}
  };
  // Global Variables ---->>> Consider Bad programming practice for specific uses. In this case it was allowed.
  int list_size = 0;
  Node* list; //The begging of the list from where all other elements are pointed.
  
public:
  /**
   @brief Inserts a new element in the list.
   @param new_element_data is the data of the new element you want to insert.
   @param key_value is the key value that the new element will have.
   */
  void insert_element (data_type new_element_data, int key_value) {
    list_size++;
    list = realloc(list, list_size * sizeof(Node));
    
    // Used to maintain the heap property.
    shift_up (list_size);
  }
  /**
   @brief Gets the key value of the first element of the queue.
   @return an int becuase that's the key data type.
   @remarks Because the max value is in the tree's root this just return the value at the root of the tree.
   */
  int get_maximum_key () {
    return list[0]->get_my_key_value;
  }
  /**
   @brief Gets the value of the first element of the queue.
   @return a template beacuse it's generic code.
   @remarks Because the max value is in the tree's root this just return the value at the root of the tree.
   */
  data_type get_maximum_value () {
    return list[0]->get_my_data;
  }
  /**
   @brief Returns and delete the first element from the list.
   @return A reference to the first element of the list.
   */
  data_type *extract_max () {
    data_type* max = list[0];
    // Replaces the value in the root.
    list[0] = list[list_size];
    list_size--;
    // Shift down the replaced element, manteinning the heap property.
    shift_down(0);
    
    return max;
  }
  /**
   @brief Increases the key value of the element in the index receive.
   @param new_key is the new key value, it must be bigger that the current one.
   @param element_index is the index from the list that wants to be aumented.
   */
  void increase_key (int new_key, int element_index) {
    if (new_key > list[element_index]->get_my_key_value) {
      list[element_index] = new_key;
      shift_up(element_index);
    }
  }
  /**
   @brief Swap the incorrectly placed node with a larger child until the heap property is satisfied.
   @param index is the index of the incorrect node.
   */
  void shift_down (int index) { //ADJUNTO EL P
    int max_index = index;
    
    // Left Child
    int left_child_index = get_left_child_index(index);
    
    if (left_child_index <= list_size && list[left_child_index] > list[max_index]) {
      max_index = left_child_index;
    }
    
    // Right Child
    int right_child_index = get_right_child_index(index);
    
    if (right_child_index <= list_size && list[right_child_index] > list[max_index]) {
      max_index = right_child_index;
    }
    
    // If the index is not same as the maximum index.
    if (index != max_index) {
      // Changes the items.
      Node* tmp = list[index];
      list[index] = list[max_index];
      max_index = tmp;
      shift_down(max_index);
    }
  }
  /**
   @brief Swap the incorrectly placed node with its parent until the heap property is satisfied.
   @param index is the index of the incorrect node.
   @remarks It's one of the most importan bacause help manteining the heap property.
   */
  void shift_up (int index) {
    while (index > 0 && list[get_parent_index(index)] < list[index]) {
      // Changes the parent and current node.
      Node* tmp = list[get_parent_index(index)];
      list[get_parent_index(index)] = list[index];
      list[index] = tmp;
      index = get_parent_index(index);
    }
  }
  /**
   @brief Gets the index of the parent of a child element.
   @param index is the child index for which we want to find the parent.
   @remarks It's one of the most importan bacause help manteining the heap property.
   */
  int get_parent_index (int index) {
    return (index - 1) / 2; // Because of how the heap is divided.
  }
  /**
   @brief Gets the index for the left child of a node.
   @param index is the element for which we to find the left child.
   */
  int get_left_child_index (int index) {
    return 2*index + 1; // Because of how the heap is divided.
  }
  /**
   @brief Gets the index for the right child of a node.
   @param index is the element for which we to find the right child.
   */
  int get_right_child_index (int index) {
    return 2*index + 2; // Because of how the heap is divided.
  }
};


#endif /* list_h */
