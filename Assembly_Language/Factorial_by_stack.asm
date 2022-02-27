global factorial
factorial:
  call mfact
  ret

mfact:
  push rdi

  cmp rdi, 0
	jle trivial
	
  dec rdi        
  call mfact
  mov rbx, rax
  
  mov rax, rdi
  mul rbx
  jmp terminar

trivial:    
	mov rax, 0x01	
terminar:  
	pop rdi		
  inc rdi
  ret