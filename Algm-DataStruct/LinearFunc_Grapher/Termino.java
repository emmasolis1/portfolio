// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

package ecci.tarprog2;

/**
 *
 * @author emma
 */
public class Termino {
  private int grado; // Exponente de la variable.
  private double coeficiente; // Numero que multiplica a la variable.
  private String termino; // Termino completo, sin dividir.
  private double imagen; // Es la imagen del termino siendo evaluado para f(x).

  /*
   * Function: recibe un String de cada termino y lo divide en las partes
   * indicadas.
   */
  public Termino(String t) {
    this.termino = t; // Guardo la forma en String del termino.
    t = t.replace("^", ""); // De esta forma me aseguro de dejar el termino de la forma
                            // coeficiente-variable-exponente.
    t = t.replace("*", ""); // De esta forma me aseguro de dejar el termino de la forma
                            // coeficiente-variable-exponente.
    int indiceX = t.indexOf("x"); // Es el indice de la primera aparicion de la parte literal. Tengo que tomarla
                                  // en cuenta para poder separar el termino.
    this.imagen = 0; // Por el momento no ha sido evaluado para ninguna f(x).

    /*
     * Tengo que considerar tres posibles casos distintos. 10x5 -----> Este es el
     * MAS COMUN porque todos se pueden resumir en este. 10x ------> Significa que
     * es de grado 1. 10 -------> Significa que el grado es 0.
     */
    if (indiceX < 0) { // Esto quiere decir que es de la forma: 10. Porque no existe la letra 'x' en el
                       // String.
      this.coeficiente = Double.parseDouble(t); // El termino es toda la expresion.
      this.grado = 0; // En este caso no existe variable.

    } else { // Si existe 'x' quiere decir que es de la forma: 10x5 u 10x. En caso de ser la
             // ultima significa que el grado es 1.
      if (t.endsWith("x") == true) { // Quiere decir que es de la forma: 10x.
        this.coeficiente = Double.parseDouble(t.substring(0, (t.indexOf("x")))); // Solo extraigo el coeficiente.
        this.grado = 1; // En este caso el grado es 1.

      } else { // Entonces es de la forma: 10x5.
        this.coeficiente = Double.parseDouble(t.substring(0, (t.indexOf("x")))); // Le resto 1 para llegar hasta antes
                                                                                 // de la 'x'.
        String gradoEnTexto = t.substring(t.indexOf("x") + 1, t.length()); // Encuentro el grado para este termino.
        this.grado = Integer.parseInt(gradoEnTexto); // Lo convierto de String a numero.
      }
    }
  }

  public int getGrado() {
    return grado;
  }

  public double getCoeficiente() {
    return coeficiente;
  }

  public String getTermino() {
    return termino;
  }

  /*
   * Function: evalua el Termino para la f(x) que se esta pidiendo.
   */
  public double f(double preImagen) {
    imagen = coeficiente * (Math.pow(preImagen, grado)); // Esta es la forma en como esta expresado el termino, y su
                                                         // dicha formula.
    return imagen;
  }

  /*
   * Function: crea un String con el termino derivado.
   */
  public String getTerminoDerivado() {
    int gradoDerivado = 0;
    double coeficienteDerivado = 0.0;
    String terminoDerivado = "";
    if (grado == 0) { // Contemplo este caso en especial.
      terminoDerivado = "0"; // Asi lo indican las reglas de derivacion.
    } else {
      gradoDerivado = grado - 1;
      coeficienteDerivado = coeficiente * grado;
      if (grado != 0) {
        terminoDerivado = coeficienteDerivado + "x^" + gradoDerivado;
      }
    }
    return terminoDerivado;
  }
}