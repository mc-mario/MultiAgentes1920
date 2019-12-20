//Última versión
//Realizado por el Grupo 4
////MIGUEL ENRIQUE JÁTIVA JIMÉNEZ
////RUBÉN MARTÍNEZ SOTOCA
////ANGIE JULIANA MANTILLA GÓMEZ

//Última modificación: 18/12/2019

//Funcion para cargar la cabecera del mensaje (todos comparten la misma cabecera)
function cargarXMLCabecera(xml){
    var docXML = xml.responseXML;

    var cabecera = {
        idMensaje: docXML.getElementsByTagName("idMensaje")[0].childNodes[0].nodeValue,  
        ipEmisor: docXML.getElementsByTagName("ipEmisor")[0].childNodes[0].nodeValue,
        idEmisor: docXML.getElementsByTagName("idEmisor")[0].childNodes[0].nodeValue,
        ipReceptor: docXML.getElementsByTagName("ipReceptor")[0].childNodes[0].nodeValue,
        idReceptor: docXML.getElementsByTagName("idReceptor")[0].childNodes[0].nodeValue,
        tipoMensaje: docXML.getElementsByTagName("tipoMensaje")[0].childNodes[0].nodeValue,
        fecha: docXML.getElementsByTagName("fecha")[0].childNodes[0].nodeValue,
        horaEnvio: docXML.getElementsByTagName("horaEnvio")[0].childNodes[0].nodeValue,
        horaRecepcion: docXML.getElementsByTagName("horaRecepcion")[0].childNodes[0].nodeValue
    };

    //Devolvemos la cabecera tipo objeto con toda la informacion del mensaje 
    return cabecera;
}


//Funcion para cargar el cuerpo del mensaje (cada tipo mensaje hacemos una cosa)
function cargarXMLCuerpo(xml){
    var parser = new DOMParser();
    var docXML = parser.parseFromString(xml.responseText, "application/xml");
    
    var tipoMensaje = docXML.getElementsByTagName("tipoMensaje")[0].childNodes[0].nodeValue;

    //Mensajes para la conexion/desconexion (tipo de mensaje: TSAT )
    if (tipoMensaje.localeCompare("TSAT") == 0 ){ //quitado el tipo TAAT
        var tiendas = docXML.getElementsByTagName("tienda"); // cambiado por 'tienda'
        var ipsTiendas = [];
        var idsTiendas = [];

        for (var i = 0; i < tiendas.length; i++){
            ipsTiendas.push(tiendas[i].getElementsByTagName("ip")[0].textContent);
            idsTiendas.push(tiendas[i].getElementsByTagName("id")[0].textContent);
        }

        var cuerpo = {
            protocolo: docXML.getElementsByTagName("protocolo")[0].childNodes[0].nodeValue,
            ipsTiendas: ipsTiendas,
            idsTiendas: idsTiendas
        };
    }

    //Mensajes tipo ACK Acceso a Tienda
    if (tipoMensaje.localeCompare("TAAT") == 0){
        var cuerpo = {
            ack: docXML.getElementsByTagName("ACK")[0].childNodes[0].nodeValue
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

        for (var i = 0; i < productos.length; i++){
            idsProductos.push(productos[i].getElementsByTagName("idProducto")[0].textContent);
            cantidadesProductos.push(productos[i].getElementsByTagName("cantidad")[0].textContent);
            preciosProductos.push(productos[i].getElementsByTagName("precio")[0].textContent);
        }

        var cuerpo = {
            idsProductos: idsProductos,
            cantidadesProductos: cantidadesProductos,
            preciosProductos: preciosProductos
        };
        console.log(cuerpo.idsProductos.toString());
    }

    //Mensajes para la consulta de otras tiendas (tipo mensaje: TDOT)
    if(tipoMensaje.localeCompare("TDOT") == 0){
        var cuerpo = {
            //Tipo vacio
            solt: docXML.getElementsByTagName("solicitud")[0].childNodes[0].nodeValue
        };
    }
        
    //Mensajes para la consulta toma tiendas (tipo mensaje: TTT)
    if (tipoMensaje.localeCompare("TTT") == 0){
        var direcciones = docXML.getElementsByTagName("direccion");
        var compradores = [];
        var ips = [];
        var ids = [];

        for (var i = 0; i < direcciones.length; i++){
            compradores.push(direcciones[i].getElementsByTagName("comprador")[0].textContent);
            ips.push(direcciones[i].getElementsByTagName("ip")[0].textContent);
            ids.push(direcciones[i].getElementsByTagName("id")[0].textContent);
        }

        var cuerpo = {
            compradores: compradores,
            ips: ips,
            ids: ids
        };
    }

    //Comprobamos el correcto funcionamiento y parseo de XML (Peticion)
    if(tipoMensaje.localeCompare("PRUEBA_PETICION") == 0){
        var cuerpo = {
            stringPruebaPeticion: docXML.getElementsByTagName("stringPruebaPeticion")[0].childNodes[0].nodeValue 
            //si no se pone childnodes devuelve 'undefined'
        };
    }

    //Comprobamos el correcto funcionamiento y parseo de XML (Respuesta)
    if(tipoMensaje.localeCompare("PRUEBA_RESPUESTA") == 0){
        var cuerpo = {
            stringPruebaRespuesta: docXML.getElementsByTagName("stringPruebaRespuesta")[0].childNodes[0].nodeValue
        };
    }

    //Devolvemos el objeto 'cuerpo'
    alert(tipoMensaje)
    alert(JSON.stringify(cuerpo))
    return cuerpo;
}
