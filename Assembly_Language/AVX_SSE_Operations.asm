section .data
  nuno: dd -1.0

section .text

global vectorial_product_scalar_avx
vectorial_product_scalar_avx:
  ; First component.

  ; (m_vector[1]*n_vector[2])
  vmovss xmm0, [rdi+4]
  vmovss xmm1, [rsi+8]
  vmulss xmm0, xmm1

  ; (m_vector[2]*n_vector[1])
  vmovss xmm2, [rdi+8]
  vmovss xmm3, [rsi+4]
  vmulss xmm2, xmm3
  
  ; (m_vector[1]*n_vector[2]) - (m_vector[2]*n_vector[1])
  vsubss xmm0, xmm2
  vmovss [rdx], xmm0

  ; Second component.

  ; (m_vector[0]*n_vector[2])
  vmovss xmm0, [rdi]
  vmovss xmm1, [rsi+8]
  vmulss xmm0, xmm1

  ; (m_vector[2]*n_vector[0])
  vmovss xmm2, [rdi+8]
  vmovss xmm3, [rsi]
  vmulss xmm2, xmm3

  ; (m_vector[0]*n_vector[2]) - (m_vector[2]*n_vector[0])
  vsubss xmm0, xmm2
  vmovss xmm4, [nuno]
  vmulss xmm0, xmm4
  vmovss [rdx+4], xmm0

  ; Third component.

  ; (m_vector[0]*n_vector[1])
  vmovss xmm0, [rdi]
  vmovss xmm1, [rsi+4]
  vmulss xmm0, xmm1

  ; (m_vector[1]*n_vector[0])
  vmovss xmm2, [rdi+4]
  vmovss xmm3, [rsi]
  vmulss xmm2, xmm3

  ; (m_vector[0]*n_vector[1]) - (m_vector[1]*n_vector[0])
  vsubss xmm0, xmm2
  vmovss [rdx+8], xmm0

  ret

global vectorial_product_scalar_sse
vectorial_product_scalar_sse:
  ; First component.

  ; (m_vector[1]*n_vector[2])
  movss xmm0, [rdi+4]
  movss xmm1, [rsi+8]
  mulss xmm0, xmm1

  ; (m_vector[2]*n_vector[1])
  movss xmm2, [rdi+8]
  movss xmm3, [rsi+4]
  mulss xmm2, xmm3
  
  ; (m_vector[1]*n_vector[2]) - (m_vector[2]*n_vector[1])
  subss xmm0, xmm2
  movss [rdx], xmm0

  ; Second component.

  ; (m_vector[0]*n_vector[2])
  movss xmm0, [rdi]
  movss xmm1, [rsi+8]
  mulss xmm0, xmm1

  ; (m_vector[2]*n_vector[0])
  movss xmm2, [rdi+8]
  movss xmm3, [rsi]
  mulss xmm2, xmm3

  ; (m_vector[0]*n_vector[2]) - (m_vector[2]*n_vector[0])
  subss xmm0, xmm2
  movss xmm4, [nuno]
  mulss xmm0, xmm4
  movss [rdx+4], xmm0

  ; Third component.

  ; (m_vector[0]*n_vector[1])
  movss xmm0, [rdi]
  movss xmm1, [rsi+4]
  mulss xmm0, xmm1

  ; (m_vector[1]*n_vector[0])
  movss xmm2, [rdi+4]
  movss xmm3, [rsi]
  mulss xmm2, xmm3

  ; (m_vector[0]*n_vector[1]) - (m_vector[1]*n_vector[0])
  subss xmm0, xmm2
  movss [rdx+8], xmm0

  ret

global vectorial_product_vectorized_avx_
vectorial_product_vectorized_avx_:
  ; SET COMPONENTS
  vmovaps xmm0, [rdi] ;xmm0 = a
  vmovaps xmm1, [rsi] ;xmm1 = b
  vmovaps xmm3, [rcx] ;xmm3 = d
  vmovaps xmm4, [r8]  ;xmm4 = e

  ; Components multiplicacion.
  vmulps xmm2, xmm0, xmm1
  vmulps xmm5, xmm3, xmm4

  ; Components substraction.
  vhsubps xmm6, xmm5, xmm2

  ; The results are in the 3 upper 32 bits of xmm6.
  vmovaps [rdx+0], xmm6

  ret

global vectorial_product_vectorized_sse_
vectorial_product_vectorized_sse_:
  ; SET COMPONENTS
  movaps xmm0, [rdi] ;xmm0 = a
  movaps xmm1, [rsi] ;xmm1 = b
  movaps xmm3, [rcx] ;xmm3 = d
  movaps xmm4, [r8]  ;xmm4 = e

  ; Components multiplicacion.
  mulps xmm0, xmm1
  mulps xmm3, xmm4

  ; Components substraction.
  hsubps xmm0, xmm3

  ; The results are in the 3 upper 32 bits of xmm6.
  movaps [rdx+0], xmm0

  ret