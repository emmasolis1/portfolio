/*
* Choosed Table: ...
* Key type: std::string.
*/

#ifndef HASH_TABLE_H
#define HASH_TABLE_H

template <typename data_type>
class Hash_table {
private:
  class table{
    std::string key;
    data_type data;
  };
  int32_t stored_elements;
  table* my_hash_table;
  table& find_by_key(std::string);

public:
  /**
   * @brief Construct a new hash table object
   */
  Hash_table();

  /**
   * @brief Destroy the hash table object
   */
  ~Hash_table();

  /**
   * @brief It hashes the table.
   */
  void hash();  

  /**
   * @brief Get the data_type object stored in the hash table for the received key.
   * @param key 
   * @return data_type 
   */
  data_type get_data(std::string key);

  /**
   * @brief Inserts a new elements for the list in the list in the received key.
   * @param key 
   * @param data 
   */
  void insert(std::string key, data_type data);

  /**
   * @brief Get the number of elements stored in the hash table.
   * @return int 
   */
  int32_t get_size();
};

#endif /* HASH_TABLE_H */