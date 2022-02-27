section .text
global _ackermann
_ackermann:
  ; Program logic
  cmp edi, 0x0 ; Base case (m==0).
  jle _casem0

  _case_n0:  ; Second posible case, NOT base case (n==0).
    cmp esi, 0x0
    jne _caseN_not0

    dec edi
    xor esi, esi ; Optimizacion 1.
    inc esi
    call _ackermann
    jmp _exit

  _caseN_not0:  ; Third and most possible case, NOT the base case (m!=0 && n!=0).
    ; Put in esi the return value from another call to recursive ackermann.
    dec esi
    push rdi ; Preserve this registers
    call _ackermann
    pop rdi
    ; Continue with the primary recursive call.
    mov esi, eax
    dec edi
    call _ackermann
    jmp _exit

  _casem0:
    inc esi
    
  _exit:
    mov rax, rsi ; Set return value.
    ret