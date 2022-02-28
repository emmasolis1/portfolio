#include "sys/mman.h"
#include "stdlib.h"

#ifndef MY_PIPE_H
#define MY_PIPE_H

#define MAX_PIPE_SIZE 1021

// Creates a pipe
char* my_pipe();

// Function to write into the shared memory pipe
int my_write(char* pipe, char * buffer, int buffer_size);

// Function to read from the shared memory pipe
// copies into the buffer parameter the message that is inside the pipe
int my_read(char* pipe, char* buffer, int buffer_size);
#endif // MY_PIPE_H