# Etapa 4  PI - CIA
<img src="https://cdn.wallpapersafari.com/14/0/wHYQgF.png" alt="drawing" width="200"/>

## Integrantes
* Carlos Valle.
* Emmanuel D. Solis.
* Gilbert Marquez.
* Javier Molina.

---

# Diseño de File System:

En el anillo interno, los datos enviados por las áreas de salud se deben guardar de manera
persistente en algún sistema de almacenamiento. En este caso, al ser datos de pacientes, es
importante que se encuentren disponibles incluso cuando alguno de los equipos presenta algún
tipo de falla.
Para esto debe diseñar en primer lugar un file system que le permita almacenar la información
de las vacunas de los pacientes de manera estructurada donde pueda agregar datos con el paso
del tiempo y pueda recuperar la información necesaria en un futuro. Para esto tome en cuenta:

## ¿Necesita una estructura de directorios?

En realidad un sistema de directorios no sería estrictamanete necesario. Sin embargo, los directorios permiten ordenar de manera más eficaz y ordenada la información para el usuario, tomando en cuenta que el volumen de datos que estaría recibiendo cada área de salud sería relativamente grande; nos parece que contar con un sistema de directorios sería lo mejor para evitar complicaciones a los usuarios del sistema.

## ¿Qué atributos necesita cada archivo?
Los siguientes atributos serían parte de los Nodos-i de nuestro sistema de archivos.

* **Nombre de archivo:** Sirve como identificador del archivo en un directorio determinado.
* **Creador:** Es utilizado para conocer el usuario que creó el archivo.
* **Dirección en disco:** Contiene la dirección del archivo en el disco, necesaria para acceder a este.
* **Ruta:** Ruta del archivo en el sistema de directorios, necesaria para que los usuarios sepan en qué directorio se encuentra determinado archivo.
* **Tamaño actual:** Indica el tamaño actual del archivo en bytes.
* **Tamaño máximo:** Indica el máximo de bytes hasta donde puede crecer el archivo.
* **Protección:** Indica si el archivo puede ser modificado o no.
* **Fecha y hora de creación:** Indica la fecha y hora en la que fue creado el archivo.
* **Fecha y hora de último accesso:** Indica la fecha y hora en la fue accedido el archivo por última vez.
* **Fecha y hora de modificación:** Indica la fecha y la hora de la última modificación realizada al archivo.

## ¿Qué datos debe llevar el superbloque del file system?
El superbloque debe contener el denominado número mágico, que cumple la función de identificar el tipo de sistema de archivos, la cantidad de bloques que contiene dicho sistema, el tamaño máximo del fichero, el índice del primer bit libre en el bitmap de los nodos-i y el número de nodos-i en el sistema de archivos.

## ¿Qué tamaño de bloque considera adecuado para su diseño?
Tomando en cuenta que el rendimiento y uso de memoria óptimos son mutuamente excluyentes a la hora de definir un tamaño de bloque, se hace necesario encontrar un punto intermedio. Si un archivo está compuesto por muchos bloques, se hace un buen uso de la memoria; sin embargo, el rendimiento es malo. Lo contrario es cierto en el caso de que los bloques sean mucho más grandes que los archivos, en otras palabras, el rendimiento sería muy bueno pero se haría un pobre uso de la memoria, causando gran segmentación.
Por ende, consideramos que el tamaño de bloque ideal es equivalente al tamaño promedio de los archivos. Proyectamos un promedio para el tamaño de los archivos de aproximadamente 15Kb; lo que significa que pensamos que el tamaño ideal de bloque es de 15Kb. 


## ¿Qué es un RAID 1+0?
Para llegar a entender mejor el concepto de RAID 1+0 es importante comprender lo que es un RAID 1 y RAID 0. A continuación se brinda una breve explicación de cada uno:

* **Raid 0**: El sistema Raid 0 consiste en segmentar los archivos en una cantidad par de discos determinada. Esto genera un aumento del rendimiento a la hora de acceder a los archivos, debido a que el sistema operativo accede concurremente a los diversos segmentos que componen el archivo. Este sistema tiene el inconveniente de que cada uno de los discos es dependiente de los demás, si alguno de estos sufre una falla, todos los archivos quedarían con información incompleta; lo que repercutiría en la pérdida total de los datos.
![](https://i.imgur.com/44h6OyK.png)


* **Raid 1**: El sistema Raid 1 consiste en el duplicado de la información en varios discos, podría expresarse como un conjunto de discos espejo, donde todos contienen la misma infromación. Su propósito es el de ofrecer respaldo de la información en caso de fallo en alguno de los discos. Sin embargo, posee la desventaja de que se requiere el doble de memoria entre todos los discos.
![](https://i.imgur.com/XkerlHV.png)


* **Raid 1+0**: Este sistema es el producto de una fusión entre el Raid 1 y el Raid 0, consiste en subgrupos de discos que funcionan como uno, mediante el sistema Raid 1; y estos subgrupos se coordinan mediante Raid 0.
![](https://i.imgur.com/iBlApCO.png)



## ¿Cómo funciona el RAID 1+0? ¿Qué ventajas brinda?


Este sistema funciona mediante la segmentación de archivos en varios grupos de discos; cada uno de estos grupos funcionan como un único disco, debido a que emplean el sistema Raid 1. El sistema Raid 1+0 posee las virtudes de Raid 1 y Raid 0, es decir, ofrece un acceso veloz a los datos y a la vez, contiene respaldos en caso de errores. La principal desventaja de este sistema es la misma presente en Raid 1, los discos "espejo" causan una duplicación del espacio requerido para su implementación.


## Diagrama final del sistema de archivos

![](https://i.imgur.com/QQ7NUfX.png)

![](https://i.imgur.com/Nix4uCH.png)

![](https://i.imgur.com/8q7xXpY.png)

