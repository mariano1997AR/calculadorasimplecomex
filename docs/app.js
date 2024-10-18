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
const baseImpIva = document.getElementById('baseImpIva');
const form = document.getElementById('form');
const inputs = form.querySelectorAll('input');

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
     const datosEnvios = ["entrega en capital","entrega en provincia bsas", "retiro en aerobox","Envio al interior domicilio"];


     calcular.addEventListener('click',() =>{
    
                if(isNaN(this.peso) || isNaN(this.valor)){
                    console.log('campo vacio')
                }else{
                    let calcularFlete = this.calcularFlete(this.peso);  
                    let calcularSeguro = this.calcularSeguro(calcularFlete,this.valor);            
                    let valorAduana = this.calcularBaseCalculo(this.valor, calcularFlete,calcularSeguro);
                    resultadoFlete.innerHTML = `<h4>$${calcularFlete}</h4>`;
                    resultadoSeguro.innerHTML = `<h4>$${calcularSeguro}</h4>`;
                    baseCalculo.innerHTML = `<h4>$${valorAduana}</h4>`;
                    this.obtenerDatoJson(descripcion,estadistica,derecho,otros,posicion,iva,valorAduana);
    
                }
          

     });
     //es para cargar los select con la columna de descripcion del producto
     this.recorrerSelectDatosProducto(descripcion);
     this.cargarEnvios(datosEnvios);
    
   }


    calcularFlete(peso){
       const precioKG = 3;
       let flete = precioKG * peso; 
       return flete;
      
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
             producto.innerHTML = `<h4>${selectElement.value}<h4>`; 
       });
    }

    obtenerDatoJson(descripcion,estadistica,derecho,otros,posicion,iva,valorAduana){
         //guardar los datos en un array
        let calcularBaseImpositiva;
        let agregarIva,porcentajeIva,calcularIva;


        fetch('./datos_separados.json')
        .then(response => response.json())
        .then(data => {
              data.forEach(item => { 
                  estadistica.push(item.estadist);
                  derecho.push(item.derecho);
                  descripcion.push(item.descripcion);
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

                     console.log(parseFloat(calcularIva));
                     if((calcularBaseImpositiva == NaN) && (calcularIva == NaN)){
                         baseImp.innerHTML = 'sin datos';
                         baseImpIva.innerHTML = 'Sin datos';
                     }else{
                        baseImp.innerHTML = `<h4>$${calcularBaseImpositiva}</h4>`;
                        baseImpIva.innerHTML = `<h4>$${calcularIva}</h4>`;
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
       if (input.value.trim() === '') { // Verifica si el campo está vacío (o tiene solo espacios)
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

