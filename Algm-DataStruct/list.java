public class Lista {
  private class Celda {
    public int elemento;
    public Celda siguiente;

    public Celda(int elemento) {
      this.elemento = elemento;
    }

    public String toString() {
      String tira = "";
      tira += elemento + " ";
      if (siguiente != null) {
        tira += siguiente.toString();
      }
      return tira;
    }
  }

  private Celda primera;
  private Celda ultima;

  public Lista() {
  }

  public String toString() {
    String tira = "";
    if (!vacia()) {
      tira += primera.toString();
    }
    return tira;
  }

  public boolean vacia() {
    return primera == null;
  }

  public int popFront() {
    int elemento = 0;
    if (primera != null) {
      elemento = primera.elemento;
      primera = primera.siguiente;
      if (primera == null) {
        ultima = null;
      }
    }
    return elemento;
  }

  public int popBack() {
    int elemento = 0;
    if (primera != null) {
      elemento = ultima.elemento;
      if (primera == ultima) {
        primera = null;
        ultima = null;
      } else {
        Celda penultima = primera;
        while (penultima.siguiente != ultima) {
          penultima = penultima.siguiente;
        }
        ultima = penultima;
        penultima.siguiente = null;
      }
    }
    return elemento;
  }

  public void pushBack(int elemento) {
    Celda nueva = new Celda(elemento);
    if (vacia()) {
      primera = nueva;
      ultima = nueva;
    } else {
      ultima.siguiente = nueva;
      ultima = nueva;
    }

  }

  public void pushFront(int elemento) {
    Celda nueva = new Celda(elemento);
    if (vacia()) {
      primera = nueva;
      ultima = primera;
    } else {
      nueva.siguiente = primera;
      primera = nueva;
    }
  }

}
