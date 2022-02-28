// Copyright 2021 <Emmanuel, Javier, Gilbert, Carlos>

#include <signal.h>
#include <stdio.h>
#include <unistd.h>
#include <semaphore.h>
#include <fcntl.h>
#include <sys/types.h>
#include "UDPServer.hpp"
#include "my_pipe.h"

static UDPServer server("127.0.0.1", 5000, nullptr, nullptr, nullptr);

// Tells the program how to handle the signal for program termination
void handleSignal(int signal) {
  /* adapted from https://stackoverflow.com/questions/48378213/how-to
   -deal-with-errno-and-signal-handler-in-linux */
  if (signal) {
    int temp_errno = errno;
    server.stopServer();
    errno = temp_errno;
  }
}

int main(void) {
  signal(SIGINT, handleSignal);
  signal(SIGTERM, handleSignal);

  sem_t* canWrite = sem_open("/writeSemaphore", O_CREAT | O_EXCL, 0, 1);
  sem_t* canRead = sem_open("/readSemaphore", O_CREAT | O_EXCL, 0, 0);
  char* pipe = my_pipe();
  sem_unlink("/writeSemaphore");
  sem_unlink("/readSemaphore");
  int pid = fork();
  if (pid > 0) {
    // UDPServer server("127.0.0.1", 5000, canWrite, canRead, pipe);
    server.setWriteSemaphore(canWrite);
    server.setReadSemaphore(canRead);
    server.setPipe(pipe);
    server.startReceiving();
  } else {
    while (true) {
      sem_wait(canRead);
      char buffer[1021];
      my_read(pipe, buffer, 1021);
      printf("%s", buffer);
      sem_post(canWrite);
    }
  }
}
