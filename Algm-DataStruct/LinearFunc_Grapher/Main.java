// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

package ecci.tarprog2;

/**
 *
 * @author emma
 */
public class Main {
  public static void main(String[] argv) {
    final String casoPrueba1 = "10^x3 + 5x2 + 2x + 12"; // -----> Funciona.
    final String casoPrueba2 = "-10X3 +-5X^2"; // --------------> Funciona.
    final String casoPrueba3 = "-10x^3 - 5x2"; // --------------> Funciona.

    ecci.tarprog2.Graficador g = new Graficador();
    g.setVisible(true);

  }
}