// Copyright 2021 <Emmanuel, Javier, Gilbert, Carlos>

#include "my_pipe.h"

// Creates a pipe
char* my_pipe() {
  // Creates a shared memory block
  char* pipe = (char*)(mmap(NULL, MAX_PIPE_SIZE,
    PROT_READ |PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, 0, 0));
  if (pipe == MAP_FAILED) {
    return NULL;
  }
  return pipe;
}

// Function to write into the shared memory pipe
int my_write(char* pipe, char * buffer, int buffer_size) {
  int return_error = 0;
  if (pipe) {
    for (int i = 0; i < buffer_size; i++) {
      pipe[i] = buffer[i];
    }
  } else {
    return_error = 1;
  }
  return return_error;
}

// Function to read from the shared memory pipe
// copies into the buffer parameter the message that is inside the pipe
int my_read(char* pipe, char* buffer, int buffer_size) {
  int return_error = 0;
  if (buffer) {
    for (int i = 0; i < buffer_size; i++) {
      buffer[i] = pipe[i];
    }
  } else {
    return_error = 1;
  }
  return return_error;
}
