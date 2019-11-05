/* TIPO LISTA DE LA COMPRA */

function writeMessageTLC(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, arrayIdsProducto, arrayCantidad){
    //Crea un XML con la cabecera generada
    var xmlDoc = createXML(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, 'TLC');

    //Añade el cuerpo del XML
    writeBodyTLC(xmlDoc, arrayIdsProducto, arrayCantidad);

    /* Pruebas en el navegador */
    //writeBodyTLC(xmlDoc, ['producto 1', 'producto 2'], [3, 6]);
    //console.log(xmlDoc.getElementsByTagName("idProducto")[1].childNodes[0].nodeValue);
    
    //Devuelve el XML generado
    return xmlDoc;
}

//Añade al cuerpo del mensaje el tipo Lista de la compra
function writeBodyTLC(xmlDoc, arrayIdsProducto, arrayCantidad){
    addListaCompraTLC(xmlDoc);
    
    //Añade los productos (con su id y cantidad) como hijos de listaCompra
    for(var i = 0; i < arrayIdsProducto.length; i++){
        addProductoTLC(xmlDoc, arrayIdsProducto[i], arrayCantidad[i], i);
    }

    return xmlDoc;
}

//Añade el nodo lista compra al documento xml
function addListaCompraTLC(xmlDoc){
    //Crea el nodo listaCompra y lo añade como hijo del nodo cuerpo
    var nodeListaCompra = xmlDoc.createElement("listaCompra");
    xmlDoc.getElementsByTagName("cuerpo")[0].appendChild(nodeListaCompra);
}

//Añade el nodo producto (con sus ids y cantidades correspondientes) al documento xml
function addProductoTLC(xmlDoc, idProducto, cantidad, i){
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
}