// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

package ecci.tarprog2;

/**
 *
 * @author emma
 */
public class Polinomio {
  private String polinomioOriginal; // Polinomio original en la forma que fue introducida por el usuario.
  private String polinomioEstandar; // Forma de representacion estandar en que se dejan todos los polinomios.
  private String polinomioSimpificado; // Polinomio que lo dejo en la forma como lo voy a trabajar para luego poder
                                       // dividirlo con un .split(" + ");
  private String[] polinomioSeparado; // Polinomio divido en terminos.
  private Termino[] terminos; // Polinomio divido en en una clase Termino por cada termino.

  /*
   * Function: recibir una String que representa un polinomio y con ella construir
   * la clase. El formato de las hileras puede variar de usuario a usuario, por
   * ejemplo: “2*x^3 + -1*x^1 + 7*x^0” debe producir un polinomio equivalente a
   * “2x3 - x + 7”.
   */
  public Polinomio(String p) {
    // Guardo el polinomio a como fue introducido por el usuario.
    this.polinomioOriginal = p;

    /*
     * Algoritmo para convertirlo en polinomio ESTANDAR. 1. Conviertalo a
     * minusculas. 2. Quite los espacios. 3. Reemplace cualquier "+ -" o "+-" por un
     * "-". 4. Quite cualquier "x^1, x1" o "x^0, x0"
     */
    this.polinomioEstandar = p;
    polinomioEstandar.toLowerCase(); // 1. Lo paso a minusculas.
    polinomioEstandar.replace(" ", ""); // 2. Quito los espacios.
    // 3. Reemplazo cualquier "+ -" o "+-" por un "-".
    polinomioEstandar.replace("+ -", "-");
    polinomioEstandar.replace("+-", "-");
    // 4. Quito cualquier "x^1, x1" por un "x", o "x^0, x0" por un "".
    polinomioEstandar.replace("x^1", "x");
    polinomioEstandar.replace("x1", "x");
    polinomioEstandar.replace("x^0", "");
    polinomioEstandar.replace("x0", "");

    /*
     * Algoritmo para convertir el polinomio SIMPLIFICADO. 1. Quito los espacios. 2.
     * Reemplazo los "+-" o los "+ - ", por un " -". 3. Reemplazo los "+" por un
     * " ". 4. Hago un .split(" ").
     */
    this.polinomioSimpificado = p.toLowerCase();
    this.polinomioSimpificado = polinomioSimpificado.replace("-", "+ -");
    this.polinomioSimpificado = polinomioSimpificado.replace("+ -", "+-");
    this.polinomioSimpificado = polinomioSimpificado.replace(" ", "");
    this.polinomioSimpificado = polinomioSimpificado.replace("+", " ");
    this.polinomioSimpificado = polinomioSimpificado.replace("  -", " -");
    if (this.polinomioSimpificado.startsWith(" ")) { // En caso de que empiecen con un espacio.
      this.polinomioSimpificado = polinomioSimpificado.substring(1); // Para quitar el espacio del espacio.
    }
    if (this.polinomioSimpificado.endsWith(" ")) { // En caso de que empiecen con un espacio.
      this.polinomioSimpificado = polinomioSimpificado.substring(0, (polinomioSimpificado.length() - 2));
    }
    this.polinomioSeparado = polinomioSimpificado.split(" ");

    // Creo los objetos de Terminos.
    terminos = new Termino[polinomioSeparado.length];
    for (int i = 0; i < terminos.length; i++) {
      terminos[i] = new Termino(polinomioSeparado[i]); // Mando el String de lo que estoy creando.
    }
  }

  /*
   * Function: Evalúa el polinomio para el valor f(x).
   */
  public double f(double f) {
    double imagen = 0.0; // Resultado de evaluar el polinomio para f(x).
    for (int i = 0; i < terminos.length; i++) {
      imagen += terminos[i].f(f);
    }
    return imagen;
  }

  /*
   * Function: sobrecargar el método toString, de manera que cuando un usuario
   * quiera imprimir su polinomio, en lugar de recibir la dirección de memoria se
   * imprima la versión textual de su polinomio. Está versión debe tener un
   * estándar específico que usted prefiera, pero no debe simplemente retornar la
   * versión del usuario.
   */
  // @override
  public String toString() {
    return polinomioEstandar;
  }

  /*
   * Function: Retorna una matriz de tamaño nx2 que representa una distribución
   * lineal de puntos (x,f(x)) entre x=a y x=b, incluyendo los puntos extremos.
   * Ejemplo: linspace(0,10,11) serían los puntos donde x=0,1,2,3,4,5,6,7,8,9,10
   */
  public double[][] linspace(double a, double b, int n) {
    double valorN = Double.parseDouble(Integer.toString(n));
    double intervalo = (b - a) / (valorN - 1.0); // Formula para que me queden los intervalos que deben ir aumentando en
                                                 // cada repeticion.
    double auxiliar = a; // Es un auxiliar para ir aumentando el numero que deseo ir enviando a la tabla
                         // de valores de 'x'.
    double[][] tablaValores = new double[n][2]; // Esta es la forma en que se pide que sea el size de la matrix.
    for (int i = 0; i < tablaValores.length; i++) { // Para ir avanzando en el array.
      tablaValores[i][0] = auxiliar; // Guardo su valor 'x'.
      tablaValores[i][1] = f(auxiliar); // Lo mando a averiguar su imagen en el metodo double f();
      auxiliar += intervalo; // Para ir cambiando la 'preimagen' que voy a mandar.
    }

    return tablaValores;
  }

  /*
   * Function: crear un nuevo objeto polinomio (sin alterar/destruir el original)
   * que sea la derivada del polinomio original y retornarlo.
   */
  public Polinomio derivative() {
    String polinomioDerivado = ""; // Representacion en un String del polinomio tomando sus terminos derivados.
    for (int i = 0; i < (terminos.length - 1); i++) { // Recorro todo el array, terminando uno antes para agregarlo
                                                      // bien.
      polinomioDerivado += terminos[i].getTerminoDerivado() + "+";
    }
    polinomioDerivado += "+" + terminos[terminos.length - 1].getTerminoDerivado(); // Le agrego la ultima parte.
    polinomioDerivado = polinomioDerivado.replace(" +0", "");
    if (polinomioDerivado.endsWith("+")) {
      polinomioDerivado = polinomioDerivado.substring(0, (polinomioDerivado.length() - 2));
    }
    polinomioDerivado = polinomioDerivado.replace("++", "+");
    polinomioDerivado = polinomioDerivado.replace("+", " + ");

    return new Polinomio(polinomioDerivado);
  }
}
