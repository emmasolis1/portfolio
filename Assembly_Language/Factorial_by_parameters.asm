global factorial
factorial:
    push rdi
    call mfact
    pop rax
    ret

mfact:
    push rbp
    mov rbp,rsp
    mov rax, [rbp+16]
	
    cmp rax,0
	jle trivial
	
    dec rax
	push rax        
	call mfact
	
    mov rax, [rbp+16]
	pop rbx		
	mul rbx		
    mov [rbp+16], rax  
    jmp terminar

trivial:    
	mov qword [rbp+16], 1	
terminar:  
	pop rbp		
    ret