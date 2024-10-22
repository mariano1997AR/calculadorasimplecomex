//referenciamos las etiquetas que vamos a utilizar de forma global
const valorMercancia = document.getElementById('valor');
const pesoMercancia = document.getElementById('peso');
const calcular = document.getElementById('calcular');
const resultadoFlete = document.getElementById('resultadoFlete');
const resultadoSeguro = document.getElementById('resultadoSeguro');
const baseCalculo = document.getElementById('baseCalculo');
const producto = document.getElementById('producto');
const baseImp = document.getElementById('baseImp');
const selectElement = document.getElementById('miSelect');
//es para obtener el valor de base impositiva con iva
const baseImpIva = document.getElementById('baseImpIva');
//es el formulario general
const form = document.getElementById('form');
//son los campos de entrada
const inputs = form.querySelectorAll('input');
//calcular el total precio con iva + flete
const totalPrecio = document.getElementById('total-precio');
//es para calcular el valor en pesos de dolares
const resultadoPesos = document.getElementById('total-precio-pesos');

//variable global al programa 
var cotizacion_dolar;

//cargar el envio
const envios = document.getElementById('envios');

//creamos la calculadora de impuestos

class CalculadoraImpuestos{
    
    //constructor(va a recibir dos valores(valor y peso))
    constructor(valor,peso){
        //Funcion para verificar si todos los campos estan completos

        calcular.addEventListener('click',(e)=>{
             e.preventDefault();
            this.valor = parseFloat(valor.value);
            this.peso = parseFloat(peso.value);
        });
       
        
    }

    //creamos los siguientes metodos;
   procesarDatos(descripcion,derecho,estadistica,otros,posicion,iva){
     const datosEnvios = ["entrega en capital","entrega en provincia bsas", "retiro en simplecomex","Envio al interior domicilio"];


     calcular.addEventListener('click',() =>{
    
                if(isNaN(this.peso) || isNaN(this.valor)){
                    console.log('campo vacio')
                }else{
                    let calcularFlete = this.calcularFlete(this.peso);  
                    let calcularSeguro = this.calcularSeguro(calcularFlete,this.valor);            
                    let valorAduana = this.calcularBaseCalculo(this.valor, calcularFlete,calcularSeguro);
                    let valorFlete = this.valorFlete(this.peso);
                    //clase css
                    resultadoFlete.classList.add('linea-horizontal');
                    resultadoFlete.innerHTML = `<h4>HANDLING: U$D ${valorFlete}</h4>`;
                   // resultadoSeguro.innerHTML = `<h4>Seguro: $${calcularSeguro}</h4>`;
                   // baseCalculo.innerHTML = `<h4>$${valorAduana}</h4>`;
                    this.obtenerDatoJson(descripcion,estadistica,derecho,otros,posicion,iva,valorAduana,valorFlete);
    
                }
          

     });
     //es para cargar los select con la columna de descripcion del producto
     this.recorrerSelectDatosProducto(descripcion);
     this.cargarEnvios(datosEnvios);
    
   }


    calcularFlete(peso){
       let precioKG = 3;
       let flete = (precioKG * peso); 
       return flete;
      
    }
    valorFlete(peso){
       let precioEnvioFijo = 30; //en dolares
       let flete = peso * precioEnvioFijo;
       return  flete;


    }

    calcularSeguro(flete,valor){
        let porcentajeSeguro = (flete + valor);
        let seguro = porcentajeSeguro * 0.01;
        return seguro;

    }

    calcularBaseCalculo(valor,flete,seguro){
          return valor + flete + seguro;
    }

    recorrerSelectDatosProducto(descripcion){
               //guardar los datos en un array
        fetch('./datos_separados.json')
        .then(response => response.json())
        .then(data => {
              data.forEach(item => { 
                  descripcion.push(item.descripcion);
               
              });
              selectElement.innerHTML = ''; // Limpiar el select
              descripcion.forEach((option,index) =>{
                const optionElement =  document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
    
              });
              selectElement.selectedIndex = 0;       
              this.obtenerResultadoSelect();
            
           

        })
        .catch(error => console.error('Error al obtener el codigo ',error));
      
             
    }

    obtenerResultadoSelect(){
       selectElement.addEventListener('change',()=>{
             producto.innerHTML = `<h4>PRODUCTO: ${selectElement.value}</h4>`; 
       });
    }

    obtenerDatoJson(descripcion,estadistica,derecho,otros,posicion,iva,valorAduana,valorFlete){
        //guardar los datos en un array
        let calcularBaseImpositiva;
        let agregarIva,porcentajeIva,calcularIva;


        fetch('./datos_separados.json')
        .then(response => response.json())
        .then(data => {
              data.forEach(item => { 
                  estadistica.push(item.estadist);
                  derecho.push(item.derecho);
                  if(!descripcion.includes(item)){
                     descripcion.push(item.descripcion);
                  }
                  iva.push(item.iva);
                  otros.push(item.otros);
                  posicion.push(item.posicion);
                  if(selectElement.value === item.descripcion){
                    //calcular la base impositiva
                     calcularBaseImpositiva = valorAduana + parseInt(item.derecho) +parseInt(item.estadist);
                     //calcular iva
                     porcentajeIva = (parseFloat(item.iva) / 100);
                     agregarIva = calcularBaseImpositiva * porcentajeIva;
                     calcularIva = (calcularBaseImpositiva + agregarIva + parseInt(item.otros)).toFixed(2);

                     if((calcularBaseImpositiva == NaN) && (calcularIva == NaN)){
                         baseImp.innerHTML = 'sin datos';
                         baseImpIva.innerHTML = 'Sin datos';
                     }else{
                        //baseImp.innerHTML = `<h4>$${calcularBaseImpositiva}</h4>`;
                        baseImpIva.innerHTML = `<h4>IMPUESTOS:U$D${calcularIva}</h4>`;
                        let total =parseFloat(valorFlete + parseFloat(calcularIva)); 
                        totalPrecio.innerHTML = `<h4 class=" text-warning">COSTO TOTAL DEL ENVIO: U$D ${total}</h4>`
                        this.cambioMoneda(total);
                    }
                    

                 }
              });
           

        })
        .catch(error => console.error('Error al obtener el codigo ',error));
        
      
    }

    cargarEnvios(datos){
        envios.innerHTML = '';
        datos.forEach((option,index) =>{
           const optionElement =  document.createElement('option');
           optionElement.value = option;
           optionElement.textContent = option.toUpperCase();
           envios.appendChild(optionElement);
        });
        envios.selectedIndex = 0;
    }
    async obtenerDolarOficial(){
        const url = "https://dolarapi.com/v1/dolares/oficial";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.log('Error al obtener el tipo de cambio oficial del dólar');
                return 0;
            }
            const data = await response.json();
            cotizacion_dolar = data["venta"];
            console.log("Tipo de cambio oficial del dólar:", cotizacion_dolar);
            return cotizacion_dolar;
        } catch (error) {
            console.error('Se produjo un error:', error);
            return 0;
        }
    }
    cambioMoneda(valorDolar){
      this.obtenerDolarOficial()
      .then(valor => {
         let cotizacion_if_fail = 885
         let valor_de_cobertura = 10;
         cotizacion_dolar = valor + valor_de_cobertura;
         //valor pasado por parametro
         if(!isNaN(valorDolar)){
            let calcularAPeso = parseFloat(valorDolar * cotizacion_dolar); //total en pesos
            resultadoPesos.innerHTML = `<h3>COSTO TOTAL EN PESOS: $${calcularAPeso}</h3>`;
         }
       
         if (cotizacion_dolar === 0) {
             cotizacion_dolar = cotizacion_if_fail;
         }

     })
     .catch(error => {
         console.error('Se produjo un error:', error);
         cotizacion_dolar = cotizacion_if_fail
      });

     
    }
   

    
};


//arrays de las columnas del documento nomeclador


//Principal
const Main = ()=>{
    let descripcion = [];
    let derecho = [];
    let estadistica = [];
    let iva = [];
    let otros = [];
    let posicion = [];
     // Función para verificar si todos los campos están completos
     function checkFormCompletion() {
       let allFieldsFilled = true;

      inputs.forEach(input => {
       //convertimos a numeros

       if ((input.value.trim() === '') && (typeof input.value) ===  "string") { // Verifica si el campo está vacío (o tiene solo espacios)
         allFieldsFilled = false;
      }
    });

    // Habilitar o deshabilitar el botón de acción
     calcular.disabled = !allFieldsFilled;
   }
   // Escuchar los eventos 'input' o 'change' en los campos
   inputs.forEach(input => {
    input.addEventListener('input', checkFormCompletion); // Para inputs tipo text y email

  });

    const calculadora = new CalculadoraImpuestos(valorMercancia,pesoMercancia);
    calculadora.procesarDatos(descripcion,derecho,estadistica,iva,otros,posicion);
   
   
    
    
}


//Correr la aplicacion
Main();

