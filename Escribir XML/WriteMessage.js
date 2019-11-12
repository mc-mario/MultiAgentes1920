//Devuelve un string con la cabecera del XML
function escribirCabecera(cabecera){
    
    xmlString = 
    "<mensaje>" +
        "<cabecera>" +
            "<idMensaje>" + cabecera.idMensaje + "</idMensaje>" +

            "<identificacionEmisor>" +
                "<ipEmisor>" + cabecera.ipEmisor + "</ipEmisor>" +
                "<idEmisor>" + cabecera.idEmisor + "</idEmisor>" +
            "</identificacionEmisor>" +

            "<identificacionReceptor>" +
                "<ipReceptor>" + cabecera.ipReceptor + "</ipReceptor>" +
                "<idReceptor>" + cabecera.idReceptor + "</idReceptor>" +
            "</identificacionReceptor>" +

            "<tipoMensaje>" + cabecera.tipoMensaje + "</tipoMensaje>" +
            "<fecha>" + getDate() + "</fecha>" +
            "<horaEnvio>" + getTime() + "</horaEnvio>" +
            "<horaRecepcion></horaRecepcion>" + 
        "</cabecera>" +

        "<cuerpo></cuerpo>" +
    "</mensaje>";

    return xmlString;
}

//Obtiene la fecha actual
function getDate(){
    var date = new Date();
    var dd = addZero(date.getDate());
    var mm = addZero(date.getMonth()+1);
    var yyyy = date.getFullYear();
    
    var today = yyyy + '-' + mm + '-' + dd;
    //console.log(today);
    return today;
}

//Obtiene la hora actual
function getTime(){
    var date = new Date();
    var hours = addZero(date.getHours());
    var minutes = addZero(date.getMinutes());
    var seconds = addZero(date.getSeconds());

    var time = hours + ":" + minutes + ":" + seconds;
    //console.log(time);
    return time;
}

//Funcion para añadir ceros a la izquierda en caso necesario para la fecha y la hora
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

//Devuelve el documento XML con la cabecera generada
function createXML(cabecera){
    //Define las variables que se necesitan en la función
    var xmlDoc, xmlString, parser

    //Crea un nuevo objeto XML DOM
    xmlDoc = document.implementation.createDocument(null, "message");

    if (cabecera.idMensaje   === undefined  ||
        cabecera.ipEmisor    === undefined  ||
        cabecera.idEmisor    === undefined  ||
        cabecera.ipReceptor  === undefined  ||
        cabecera.idReceptor  === undefined  ||
        cabecera.tipoMensaje === undefined) 
        {
            alert('Error loco');
            return;
        }

    //Crea un string con la cabecera del XML
    xmlString = escribirCabecera(cabecera);

    //Parseamos el string
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlString,"text/xml");

    return xmlDoc;
}

function convertToString(xmlDoc){
    var serializer = new XMLSerializer();
    var newXmlStr = serializer.serializeToString(xmlDoc);
    return newXmlStr;
}

function composeMessage(cabecera, cuerpo) {
    var xmlDoc = createXML(cabecera);
    var composedMessage = null;
    switch (cabecera.tipoMensaje) {
        case 'TSAT':
            composedMessage = writeBodyTSAT(xmlDoc, cuerpo.arrayTiendas);
            break;
        
        case 'TDOT':
            composedMessage = writeBodyTDOT(xmlDoc);
            break;

        case 'TCT':
            composedMessage = writeBodyTCT(xmlDoc, cuerpo.arrayIdsProducto, 
                                           cuerpo.arrayCantidad, cuerpo.arrayPrecio);
            break;

        case 'TSC':
            composedMessage = writeBodyListaCompra(xmlDoc, cuerpo.arrayIdsProducto, cuerpo.arrayCantidad);
            break;
        
        case 'TLC':
            composedMessage = writeBodyListaCompra(xmlDoc, cuerpo.arrayIdsProducto, cuerpo.arrayCantidad);
        
        default:
            alert('Error');
            break;
    }
        
    if (composedMessage === null) {
        alert('ComposedMessage is null')
    }
    return composedMessage;
}


function writeBodyTDOT(xmlDoc) {
    var solicitud = xmlDoc.createElement('solicitud');
    xmlDoc.getElementsByTagName("cuerpo")[0].appendChild(solicitud);
    return xmlDoc;
}


//Añade al cuerpo del mensaje el tipo Lista de la compra
function writeBodyListaCompra(xmlDoc, arrayIdsProducto, arrayCantidad){
    var nodeListaCompra = xmlDoc.createElement("listaCompra");
    xmlDoc.getElementsByTagName("cuerpo")[0].appendChild(nodeListaCompra);
    
    //Añade los productos (con su id y cantidad) como hijos de listaCompra
    for(var i = 0; i < arrayIdsProducto.length; i++){
            //Crea el nodo producto y lo añade como hijo de listaCompra
            var nodeProducto = xmlDoc.createElement("producto");
            xmlDoc.getElementsByTagName("listaCompra")[0].appendChild(nodeProducto);

            //Añade el nodo producto con su valor
            var nodeIdProducto = xmlDoc.createElement("idProducto");
            var valueIdProducto = xmlDoc.createTextNode(arrayIdsProducto[i]);
            nodeIdProducto.appendChild(valueIdProducto);
            xmlDoc.getElementsByTagName("producto")[i].appendChild(nodeIdProducto);

            //Añade el nodo cantidad con su valor
            var nodeCantidad = xmlDoc.createElement("cantidad");
            var valueCantidad = xmlDoc.createTextNode(arrayCantidad[i]);
            nodeCantidad.appendChild(valueCantidad);
            xmlDoc.getElementsByTagName("producto")[i].appendChild(nodeCantidad);
    }
    return xmlDoc;
}


// Cuerpo del Solicitud Acceso a Tienda
function writeBodyTSAT(xmlDoc, arrayTiendas){
    var listaTiendas = xmlDoc.createElement("listaTiendas");

    // Iteramos por cada elemento del arrayTiendas
    arrayTiendas.map((tienda) => {
        // Creamos los nodos ip e id
        var ip_tienda = xmlDoc.createElement('ip');
        var id_tienda = xmlDoc.createElement('id');
        // Extraemos la informacion de la lista y la añadimos a los nodos
        ip_tienda.appendChild(xmlDoc.createTextNode(tienda[0]));
        id_tienda.appendChild(xmlDoc.createTextNode(tienda[1]));
        // Creamos el nodo principal tienda y añadimos los datos
        var tienda = xmlDoc.createElement('tienda');
        tienda.appendChild(ip_tienda);
        tienda.appendChild(id_tienda)
        // Añadimos a la lista de tiendas el arbol de informacion
        listaTiendas.appendChild(tienda);
    });
    // Añadimos la lista de tiendas al cuerpo
    xmlDoc.getElementsByTagName("cuerpo")[0].appendChild(listaTiendas);
    return xmlDoc;
}


//Añade al cuerpo del mensaje el tipo Lista de la compra
function writeBodyTCT(xmlDoc, arrayIdsProducto, arrayCantidad, arrayPrecio){
    //Crea el nodo listaCompra y lo añade como hijo del nodo cuerpo
    var nodeListaCompra = xmlDoc.createElement("listaCompra");
    xmlDoc.getElementsByTagName("cuerpo")[0].appendChild(nodeListaCompra);
    
    //Añade los productos (con su id y cantidad) como hijos de listaCompra
    for(var i = 0; i < arrayIdsProducto.length; i++){
        //Crea el nodo producto y lo añade como hijo de listaCompra
        var nodeProducto = xmlDoc.createElement("producto");
        xmlDoc.getElementsByTagName("listaCompra")[0].appendChild(nodeProducto);

        //Añade el nodo producto con su valor
        var nodeIdProducto = xmlDoc.createElement("idProducto");
        var valueIdProducto = xmlDoc.createTextNode(arrayIdsProducto[i]);
        nodeIdProducto.appendChild(valueIdProducto);
        xmlDoc.getElementsByTagName("producto")[i].appendChild(nodeIdProducto);

        //Añade el nodo cantidad con su valor
        var nodeCantidad = xmlDoc.createElement("cantidad");
        var valueCantidad = xmlDoc.createTextNode(arrayCantidad[i]);
        nodeCantidad.appendChild(valueCantidad);
        xmlDoc.getElementsByTagName("producto")[i].appendChild(nodeCantidad);

        //Añade el nodo precio con su valor
        var nodePrecio = xmlDoc.createElement("precio");
        var valuePrecio = xmlDoc.createTextNode(arrayPrecio[i]);
        nodePrecio.appendChild(valuePrecio);
        xmlDoc.getElementsByTagName("producto")[i].appendChild(nodePrecio);
    }

    return xmlDoc;
}

var cabeceraPrueba = {
    idMensaje: 'xD',
    ipEmisor: '192.168.1.1',
    idEmisor: 'Cliente1',
    ipReceptor: '192.168.1.2',
    idReceptor: 'Tienda1',
    tipoMensaje: 'TDOT'
};

var cuerpo = {

}
