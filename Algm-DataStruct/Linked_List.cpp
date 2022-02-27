#include <iostream>
#include <stdio.h>

class Linked_list {
private:
  struct Node {
    int data;
    Node *next;
  };
  Node *head;
public:
  Linked_list() {
    head = NULL;
  }

  ~Linked_list() {
    delete head;
  }

  void insert(int my_data) {
    if (head != NULL) {
      Node *tmp = new Node;
      tmp = head;
      // Search the last element.
      while (tmp->next != NULL) {
        tmp = tmp->next;
      }
      // Insert the element.
      tmp->next = new Node;
      tmp->next->data = my_data;
      tmp->next->next = NULL;
    } else {
      head = new Node;
      head->data = my_data;
      head->next = NULL;
    }
    std::cout<<"Element " << my_data << " added to list." << std::endl;
  }

  int search(int my_data) {
    Node *tmp = new Node;
    tmp = head;
    while (tmp->next != NULL) {
      if (tmp->data == my_data) {
        break;
      } else {
        tmp = tmp->next;
      }
    }
    if (tmp == NULL || tmp->data != my_data) {
      return -1;
    } else {
      return tmp->data;
    }
  }

  int delete_element(int data) {
    int error = 0;
    Node *previous_element = head;
    Node *tmp = head->next;

    // Handle case if the element to delete is the first one.
    if (head->data == data) {
      head = tmp;
      std::cout<<"Element " << data << " deleted from list." << std::endl;
      return 0;
    }

    while(tmp != NULL) {
      if(tmp->data == data) { 
        break; 
      }
      else {
        previous_element = tmp; 
        tmp = tmp->next;
      }
    }
    // If list is empty of does not exist the element.
    if(tmp != NULL) {
      // Delete the node
      previous_element->next = tmp->next;
      delete tmp; // Avoid memory leaks.
      std::cout<<"Element " << data << " deleted from list." << std::endl;
      error = 0; // No problems.
    } else {
      std::cout << "Element "<< data <<" did not exist.\n"; 
      error = 1; 
    }
    return error;
  }

  void print_list() {
    // Handle if list is empty.
    if (head == nullptr) {
      std::cout << "List is empty." << std::endl;
    } else {
      Node *tmp = new Node;
      tmp = head;
      std::string list = "List: ";
      while (tmp != NULL) {
        //std::cout << tmp->data <<std::endl;
        list += std::to_string(tmp->data);
        list += " ";
        tmp = tmp->next;
      }
      std::cout << list << std::endl;
    }
  }
};

int main(int argc, char *argv[]){
  // Test cases.
  Linked_list *list = new Linked_list();
  list->print_list();
  list->insert(10);
  list->insert(20);
  list->insert(30);
  list->print_list();
  list->delete_element(10);
  list->print_list();

  return 0;
}
