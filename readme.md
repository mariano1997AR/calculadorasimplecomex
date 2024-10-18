# Calculadora de impuestos para comex
* Logica:
-> se ingresa valor de 100
-> se ingresa el peso de la mercancia(kg)
-> se calcula el valor del flete (3 dolares *4kg)
-> se calcula el seguro = (valor + flete ) * 1%
-> valor aduana = valor + flete + seguro 
-> se calcula la base imp  = valor aduana +  columna1(derechos de importacion) + columna2(tasa de estadistica)
-> se calcula base impositiva  = base imp + columna3(iva) + columna4(impuestos internos)


* Desarrollo:
* se va a crear una clase llamada calculadora 
* metodos para ingresarLosdatos y para procesar y guardaros en diferentes arrays(array derechoImportacion, arrayTasa de estadistica, arrayIva, arrayImpuestosInternos)
* se va a utilizar un metodo para calcular los datos y obtener
  * valor +flete +seguro -> valorAduana
  *  metodo para la base imp = valor aduana + derechoImportacion + tasaEstadistica 
  *  metodo para calcular la base imp iva = base imp + iva + impuestosInternos

* cada proceso va a tener un tiempo de espera de 1 milisegundo