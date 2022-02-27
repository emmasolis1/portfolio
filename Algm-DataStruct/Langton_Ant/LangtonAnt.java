// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

/*
 * Main rules:
 *  L: turn left 90 degrees.
 *  R: turn right 90 degrees.
 *  U: turn 180 degrees.
 *  N: no change direction.
 *
 */
package tarprogramada1;

/**
 *
 * @author emma
 */
import javax.swing.JOptionPane; //Para poder imprimir el tablero.

public class LangtonAnt {
  private char[] reglas; // Son el conjunto de reglas que se van a usar para la simulacion del ejercicio.
  private int[][] tablero; // Tablero donde se van a mover las hormigas.
  private int cantHormigas; // Cantidad de hormigas en el tablero, no pueden ser menores que 1.
  private int[][] antsCoordenadas; // Es un vector donde cada fila es una hormiga, su pos 0 es 'x', y pos 1 es 'y'
                                   // de modo que (x, y).
  private String[] antsDirections; // Es la direccion en que tienen las hormigas para avanzar. Puede ser "up",
                                   // "down", "right", "left". Debe tener el mismo length que antsCoordenadas.
  private int cantSimulaciones; // Cantidad de simulaciones con las que se desean correr.

  /*
   * Funcion: Retorna las reglas utilizadas en la simulación actual.
   */
  public char[] getRules() {
    return reglas;
  }

  /*
   * Funcion: Modifica las reglas utilizadas en la simulación. Param: Recibe las
   * nuevas reglas que se dean usar.
   */
  public void setRules(char[] rules) {
    this.reglas = new char[rules.length];

    // Copia el vector.
    for (int i = 0; i < reglas.length; i++) {
      reglas[i] = rules[i];
    }
  }

  /*
   * Funcion: Retorna la matriz del tablero en su estado actual.
   */
  public int[][] getBoard() {
    return tablero;
  }

  /*
   * Funcion: Modifica el tamaño del tablero utilizado en la simulación.
   */
  public void setBoardSize(int width, int height) {
    this.tablero = new int[width][height];
  }

  /*
   * Funcion: Modifica la cantidad de hormigas (con un mínimo de 1). Nota: Si la
   * cantidad de hormigas es 1, entonces dicha hormiga se posiciona en el centro
   * del tablero viendo a la derecha, sino entonces las hormigas se colocan en
   * posiciones aleatorias con dirección inicial aleatoria.
   */
  public void setNumberAnts(int numberAnts) {
    this.cantHormigas = numberAnts;
    this.antsCoordenadas = new int[numberAnts][2]; // Me crea esta matriz para almacenar aqui sus coordenadas.

    posicionarHormigas(); // Este metodo se encarga de decidir como las ubica, independientemente de si es
                          // una o mas de una.
    setAntsDirections(); // Esto porque este codigo se ejecuta tanto si hay solo una hormiga o mas de
                         // una.

  }

  /*
   * Funcion: se encarga darle coordenadas iniciales a las hormigas, cuando estas
   * son mas de una.
   */
  private void posicionarHormigas() {
    // En caso que solo haya una hormiga en tablero se pone en la mitad del mismo.
    if (cantHormigas == 1) {
      antsCoordenadas[0][0] = (tablero.length) / 2; // Coordenada 'x' en la mitad de las filas.
      antsCoordenadas[0][1] = (tablero[0].length) / 2; // Coordenada 'y' en la mitad de las columnas.
    } else {
      // Esto se hace para asignarle posicion a todas las hormigas.
      for (int i = 0; i < antsCoordenadas.length; i++) {
        antsCoordenadas[i][0] = (int) (Math.random() * tablero.length); // 'x' valor aleatorio de las filas.
        antsCoordenadas[i][1] = (int) (Math.random() * tablero[0].length); // 'y' valor aleatorio de las columnas.
      }
    }
  }

  /*
   * Funcion: Reinicia la simulación, coloca todo el tablero en 0 y reubica a las
   * hormigas a sus posiciones iniciales.
   */
  public void reset() {
    // Recorre todo el tablero para ponerlo en 0.
    for (int i = 0; i < tablero.length; i++) {
      for (int j = 0; j < tablero[i].length; j++) {
        tablero[i][j] = 0;
      }
    }

    // Coloca a las hormigas en sus posiciones iniciales.
    posicionarHormigas();
  }

  /*
   * Funcion: obtiene el string de todo el tablero en su estado actual.
   */
  private String toStringTablero() {
    String tableroEnTexto = "";
    for (int i = 0; i < tablero.length; i++) {
      tableroEnTexto += "\n";
      for (int j = 0; j < tablero[i].length; j++) {
        tableroEnTexto += tablero[i][j];
      }
    }
    return tableroEnTexto;
  }

  /*
   * Funcion: Imprime en terminal o por medio de un JOptionPane el tablero. Esta
   * función tiene como motivación principal facilitar el debugging de sus
   * programas.
   */
  public void printBoard() {
    JOptionPane.showMessageDialog(null, toStringTablero());
  }

  /*
   * Funcion: en base a las reglas que se dieron se ponen las direcciones que van
   * a tener las hormigas.
   */
  private void setAntsDirections() {
    // Si solo hay una hormiga se pone en el centro viendo a la derecha.
    if (cantHormigas == 1) {
      antsDirections = new String[1];
      antsDirections[0] = "right"; // Segun las reglas si solo hay una se posiciona viendo a la derecha.
    } else {
      // Si hay mas de una hormiga entonces se colocan con direcciones aleatorias.
      antsDirections = new String[cantHormigas];

      // Se les asigna la direccion en base a Math.random.
      for (int i = 0; i < antsDirections.length; i++) {
        switch ((int) (Math.random() * 4)) {
          case 0: // Viendo hacia ARRIBA.
            antsDirections[i] = "up";
            break;
          case 1: // Viendo hacia ABAJO.
            antsDirections[i] = "down";
            break;
          case 2: // Viendo hacia la IZQUIERDA/
            antsDirections[i] = "right";
            break;
          case 3: // Viendo hacia la DERECHA.
            antsDirections[i] = "left";
            break;
        }
      }
    }
  }

  /*
   * Funcion: Avanza un “paso” en la simulación actual, segun el siguiente
   * algoritmo. 1. Cada una de las hormigas verificará el estado de su cuadrícula.
   * 2. Girará acorde a la regla para dicho estado 3. Cambiará el estado de la
   * cuadrícula. 4. Avanzará un espacio.
   *
   * Matriz infinita: Si una hormiga fuese a salirse del tablero (en el
   * experimento original el tablero es “infinito”) se considerará que el tablero
   * tiene forma toroidal, lo que significa que al salir por la derecha se aparece
   * por la izquierda y viceversa, lo mismo ocurre para una hormiga que se sale
   * por arriba o abajo.
   *
   * BUG: el metodo solo debe dar 1 paso para cada hormiga. Ademas la condicion de
   * parada esta mal.
   */
  public void takeStep() {
    // Ciclo porque se tiene que ejecutar para todas las hormigas.
    for (int i = 0; i < antsCoordenadas.length; i++) {
      // Con esto verifica el estado de su actual casilla y cambia la direccion de la
      // hormiga segun la regla. Completando el 1, 2 del algoritmo.
      switch (reglas[tablero[antsCoordenadas[i][1]][antsCoordenadas[i][0]]]) // Para cada letra de las reglas.
      {
        case 'L': // Gira a la izquierda 90 grados.
          switch (antsDirections[i]) {
            case "up":
              antsDirections[i] = "left";
              break;
            case "right":
              antsDirections[i] = "up";
              break;
            case "down":
              antsDirections[i] = "right";
              break;
            case "left":
              antsDirections[i] = "down";
              break;
          }
          break;

        case 'R': // Gira a la derecha 90 grados.
          switch (antsDirections[i]) {
            case "up":
              antsDirections[i] = "right";
              break;
            case "right":
              antsDirections[i] = "down";
              break;
            case "down":
              antsDirections[i] = "left";
              break;
            case "left":
              antsDirections[i] = "up";
              break;
          }
          break;

        case 'U': // Gira 180 grados.
          switch (antsDirections[i]) {
            case "up":
              antsDirections[i] = "down";
              break;
            case "right":
              antsDirections[i] = "left";
              break;
            case "down":
              antsDirections[i] = "up";
              break;
            case "left":
              antsDirections[i] = "right";
              break;
          }
          break;

        case 'N': // No cambia de direccion. Osea no pasa nada.
          break;
      }

      /*
       * Aqui completo el paso 3 del algoritmo: cambiar el estado de la cuadrícula. En
       * caso que se quiera reemplazar con un numero mayor (letra) del que esta en el
       * conjunto "reglas". Asi evito un overflow.
       */
      int auxiliarA = tablero[antsCoordenadas[i][1]][antsCoordenadas[i][0]] + 1; // Solo para hacer la comprobacion.
      if (auxiliarA >= reglas.length) {
        tablero[antsCoordenadas[i][1]][antsCoordenadas[i][0]] = 0;
      } else {
        // Si todo esta bien entonces solo avanzo en una regla.
        tablero[antsCoordenadas[i][1]][antsCoordenadas[i][0]]++;
      }

      /*
       * Aqui completo el paso 4 del algoritmo: dar un paso. Note que aqui tengo que
       * tomar la matriz como si fuera una matriz circular que se da la vuelta.
       */
      int auxiliarB = 0; // Para que me ayude a hacer comprobaciones.
      switch (antsDirections[i]) {
        case "up": // Me muevo en las filas hacia arriba.
          // Para evitar un overflow. En caso que llegue al limite de arriba.
          auxiliarB = antsCoordenadas[i][1] - 1;
          if (auxiliarB < 0) {
            antsCoordenadas[i][1] = tablero[0].length - 1;
          } else {
            antsCoordenadas[i][1]--;
          }
          break;

        case "down": // Me muevo en las filas hacia abajo.
          // Para evitar un overflow. En caso que llegue al limite de abajo.
          auxiliarB = antsCoordenadas[i][1] + 1;
          if (auxiliarB >= tablero.length) {
            antsCoordenadas[i][1] = 0;
          } else {
            antsCoordenadas[i][1]++;
          }
          break;

        case "left": // Me muevo en las columnas hacia la izquierda.
          // Para evitar un overflow. En caso que llegue al limite izquierdo.
          auxiliarB = antsCoordenadas[i][0] - 1;
          if (auxiliarB < 0) {
            antsCoordenadas[i][0] = tablero.length - 1;
          } else {
            antsCoordenadas[i][0]--;
          }
          break;

        case "right": // Me muevo en las columnas hacia la derecha.
          // Para evitar un overflow. En caso que llegue al limite derecho.
          auxiliarB = antsCoordenadas[i][0] + 1;
          if (auxiliarB >= tablero.length) {
            antsCoordenadas[i][0] = 0;
          } else {
            antsCoordenadas[i][0]++;
          }
          break;
      }
    }
  }

  /*
   * Funcion: corre la simulacion para todas las partes de las reglas para la
   * simulacion.
   */
  public void correrSimulacion() {
    for (int i = 0; i < (cantSimulaciones + 1); i++) {
      takeStep();
    }
  }

  /*
   * Funcion: una vez que se ha terminado la simulacion coloca un asteristico
   * donde estan las hormigas. Return: regresa el tablero donde me muestra la
   * coordenadas de las hormigas.
   */
  private String toStringTableroConHormigas() {
    // Copia el tablero int en uno de String.
    String[][] board = new String[tablero.length][tablero[tablero.length - 1].length];
    for (int i = 0; i < tablero.length; i++) {
      for (int j = 0; j < tablero[i].length; j++) {
        board[i][j] = Integer.toString(tablero[i][j]);
      }
    }

    // Le agrega un asterisco a cada valor donde este las hormigas.
    for (int i = 0; i < antsCoordenadas.length; i++) {
      board[antsCoordenadas[i][0]][antsCoordenadas[i][1]] += "*";
    }

    String tableroTexto = "";
    // Pone todo en un String.
    for (int i = 0; i < board.length; i++) {
      tableroTexto += "\n";
      for (int j = 0; j < board[i].length; j++) {
        tableroTexto += board[i][j] + " ";
      }
    }

    return tableroTexto;
  }

  public void imprimirTableroConHormigas() {
    JOptionPane.showMessageDialog(null, toStringTableroConHormigas());
  }

  public void setCantSimulaciones(int number) {
    this.cantSimulaciones = number;
  }

  public int getCantSimulaciones() {
    return cantSimulaciones;
  }

  /*
   * Funcion: Retorna una matriz de coordenadas (x,y) donde cada fila posee la
   * coordenada de una hormiga en el tablero.
   */
  public int[][] getAntPositions() {
    return antsCoordenadas;
  }
}
