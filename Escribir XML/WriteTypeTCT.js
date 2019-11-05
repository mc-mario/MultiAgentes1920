/* TIPO COINCIDENCIA CON TIENDA */

function writeMessageTCT(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, arrayIdsProducto, arrayCantidad, arrayPrecio){
    //Crea un XML con la cabecera generada
    var xmlDoc = createXML(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, 'TCT');

    //Añade el cuerpo del XML
    writeBodyTCT(xmlDoc, arrayIdsProducto, arrayCantidad, arrayPrecio);

    /* Pruebas en el navegador */
    //writeBodyTCT(xmlDoc, ['producto 1', 'producto 2'], [5, 2], [10, 15]);
    //console.log(xmlDoc.getElementsByTagName("precio")[1].childNodes[0].nodeValue);
    
    //Devuelve el XML generado
    return xmlDoc;
}

//Añade al cuerpo del mensaje el tipo Lista de la compra
function writeBodyTCT(xmlDoc, arrayIdsProducto, arrayCantidad, arrayPrecio){
    addListaCompraTCT(xmlDoc);
    
    //Añade los productos (con su id y cantidad) como hijos de listaCompra
    for(var i = 0; i < arrayIdsProducto.length; i++){
        addProductoTCT(xmlDoc, arrayIdsProducto[i], arrayCantidad[i], arrayPrecio[i], i);
    }

    return xmlDoc;
}

//Añade el nodo lista compra al documento xml
function addListaCompraTCT(xmlDoc){
    //Crea el nodo listaCompra y lo añade como hijo del nodo cuerpo
    var nodeListaCompra = xmlDoc.createElement("listaCompra");
    xmlDoc.getElementsByTagName("cuerpo")[0].appendChild(nodeListaCompra);
}

//Añade el nodo producto (con sus ids y cantidades correspondientes) al documento xml
function addProductoTCT(xmlDoc, idProducto, cantidad, precio, i){
    //Crea el nodo producto y lo añade como hijo de listaCompra
    var nodeProducto = xmlDoc.createElement("producto");
    xmlDoc.getElementsByTagName("listaCompra")[0].appendChild(nodeProducto);

    //Añade el nodo producto con su valor
    var nodeIdProducto = xmlDoc.createElement("idProducto");
    var valueIdProducto = xmlDoc.createTextNode(idProducto);
    nodeIdProducto.appendChild(valueIdProducto);
    xmlDoc.getElementsByTagName("producto")[i].appendChild(nodeIdProducto);

    //Añade el nodo cantidad con su valor
    var nodeCantidad = xmlDoc.createElement("cantidad");
    var valueCantidad = xmlDoc.createTextNode(cantidad);
    nodeCantidad.appendChild(valueCantidad);
    xmlDoc.getElementsByTagName("producto")[i].appendChild(nodeCantidad);

    //Añade el nodo precio con su valor
    var nodePrecio = xmlDoc.createElement("precio");
    var valuePrecio = xmlDoc.createTextNode(precio);
    nodePrecio.appendChild(valuePrecio);
    xmlDoc.getElementsByTagName("producto")[i].appendChild(nodePrecio);
}