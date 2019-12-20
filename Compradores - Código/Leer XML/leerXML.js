//Creado por el grupo 4 (Angie, Miguel y Ruben)

//Funcion crea un objeto XMLHttpRequest, agrega la función que se ejecutará 
//cuando la respuesta del servidor esté lista y envía la solicitud al servidor
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
        }
    };
    //Especificamos la solicitud, tipo POST, segundo parametro es la direccion
    xhttp.open("POST", "http://161.67.197.10:90/hotelTienda.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var mensaje = "mensaje=sorpresa"
    //enviamos la solicitud al servidor
    xhttp.send(mensaje);
}

//Funcion para cargar la cabecera del mensaje (todos comparten la misma cabecera)
function cargarXMLCabecera(xml){
    var docXML = xml.responseXML;

    //Creamos el objeto 'cabecera' para introducir todos los datos principales de un mensaje.
    var cabecera = {
        idMensaje = docXML.getElementsByTagName("idMensaje")[0].childNodes[0].nodeValue,  
        ipEmisor = docXML.getElementsByTagName("ipEmisor")[0].childNodes[0].nodeValue,
        idEmisor = docXML.getElementsByTagName("idEmisor")[0].childNodes[0].nodeValue,
        ipReceptor = docXML.getElementsByTagName("ipReceptor")[0].childNodes[0].nodeValue,
        idReceptor = docXML.getElementsByTagName("idReceptor")[0].childNodes[0].nodeValue,
        tipoMensaje = docXML.getElementsByTagName("tipoMensaje")[0].childNodes[0].nodeValue,
        fecha = docXML.getElementsByTagName("fecha")[0].childNodes[0].nodeValue,
        horaEnvio = docXML.getElementsByTagName("horaEnvio")[0].childNodes[0].nodeValue,
        horaRecepcion = docXML.getElementsByTagName("horaRecepcion")[0].childNodes[0].nodeValue
    };

    //Devolvemos la cabecera tipo objeto con toda la informacion del mensaje 
    return cabecera;
}


//Funcion para cargar el cuerpo del mensaje (cada tipo mensaje hacemos una cosa)
function cargarXMLCuerpo(xml){
    var docXML = xml.responseXML;
    //Recogemos el tipo de mensaje
    var tipoMensaje = docXML.getElementsByTagName("tipoMensaje")[0].childNodes[0].nodeValue;

        
    //Mensajes para la conexion/desconexion (tipo de mensaje: TSAT )
    if (tipoMensaje.localeCompare("TSAT") == 0 ){ //quitado el tipo TAAT
        var tiendas = docXML.getElementsByTagName("listaTiendas"); // cambiado por 'tienda'
        var ipsTiendas = [];
        var idsTiendas = [];
        //recorremos todas las tiendas
        for (var i = 0; i < tiendas.length; i++){
            //IP tienda, añadimos informacion a la tabla y a la variable ipsTiendas
            ipsTiendas.append(tiendas[i].getElementsByTagName("ip")[0].textContent);

            //Id tienda, añadimos informacion a la tabla y a la variable idsTiendas
            idsTiendas.append(tiendas[i].getElementsByTagName("id")[0].textContent);
        }

        //Creamos el objeto cuerpo, para estos mensajes se compone de 2 etiquetas
        var cuerpo = {
            conexion = docXML.getElementsByTagName("protocolo"),
            idsTiendas = this.idsTiendas,
            ipsTiendas = this.ipsTiendas
        };
    }

    //Mensajes tipo ACK Acceso a Tienda
    if (tipoMensaje.localeCompare("TAAT") == 0){
        var cuerpo = {
            ack = docXML.getElementsByTagName("ACK")
        };
    }

    //Mensajes para la compra (tipo de mensaje: TCT, TLC, TSC y TPV)
    if (tipoMensaje.localeCompare("TCT") == 0 || tipoMensaje.localeCompare("TLC") == 0 
    || tipoMensaje.localeCompare("TSC") == 0 || tipoMensaje.localeCompare("TPV") == 0){
        //Con TCT asumimos que tiene cero o más productos, con el resto asumimos que tiene uno o más productos
        var productos = docXML.getElementsByTagName("producto");
        var idsProductos = [];
        var cantidadesProductos = [];
        var preciosProductos = [];
        //Recorremos la lista de productos
        for (var i = 0; i < productos.length; i++){
            //Id producto, añadimos informacion a la variable idsProductos
            idsProductos.append(productos[i].getElementsByTagName("idProducto")[0].textContent);

            //Cantidad, añadimos informacion a la variable cantidadesProductos
            cantidadesProductos.append(productos[i].getElementsByTagName("cantidad")[0].textContent);

            //Precio, añadimos informacion a la variable preciosProductos
            preciosProductos.append(productos[i].getElementsByTagName("precio")[0].textContent);
        }

        //Creamos el objeto cuerpo, para estos mensajes se compone de 3 etiquetas
        var cuerpo = {
            idsProductos = this.idsProductos,
            cantidadesProductos = this.cantidadesProductos,
            preciosProductos = this.preciosProductos
        };
    }

    //Mensajes para la consulta de otras tiendas (tipo mensaje: TDOT)
    if(tipoMensaje.localeCompare("TDOT") == 0){
        var cuerpo = {
            //Tipo vacio
            solt = docXML.getElementsByTagName("solicitud")
        };
    }
        
    //Mensajes para la consulta toma tiendas (tipo mensaje: TTT)
    if (tipoMensaje.localeCompare("TTT") == 0){
        var direcciones = docXML.getElementsByTagName("direccion");
        var compradores = [];
        var ips = [];
         var ids = [];
        //Recorremos las direcciones
        for (var i = 0; i < direcciones.length; i++){
            //Comprador
            compradores.append(direcciones[i].getElementsByTagName("comprador")[0].textContent);
            //IPs
            ips.append(direcciones[i].getElementsByTagName("ip")[0].textContent);
            //Ids
            ids.append(direcciones[i].getElementsByTagName("id")[0].textContent);
        }

        //Creamos el cuerpo, para estos mensajes se compone de 3 etiquetas
        var cuerpo = {
            compradores = this.compradores,
            ips = this.ips,
            ids = this.ids
        };
    }

    //Comprobamos el correcto funcionamiento y parseo de XML (Peticion)
    if(tipoMensaje.localeCompare("PRUEBA_PETICION") == 0){
        var cuerpo = {
            stringPruebaPeticion = docXML.getElementsByTagName("stringPruebaPeticion")
        };
    }

    //Comprobamos el correcto funcionamiento y parseo de XML (Respuesta)
    if(tipoMensaje.localeCompare("PRUEBA_RESPUESTA") == 0){
        var cuerpo = {
            stringPruebaRespuesta = docXML.getElementsByTagName("stringPruebaRespuesta")
        };
    }

    //Devolvemos el objeto 'cuerpo'
    return cuerpo;
}