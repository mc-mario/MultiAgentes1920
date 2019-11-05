/* TIPO SOLICITUD DE COMPRA */

function writeMessageTSC(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, arrayIdsProducto, arrayCantidad){
    //Crea un XML con la cabecera generada
    var xmlDoc = createXML(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, 'TSC');

    //Añade el cuerpo del XML
    writeBodyTSC(xmlDoc, arrayIdsProducto, arrayCantidad);

    /* Pruebas en el navegador */
    //writeBodyTLC(xmlDoc, ['producto 1', 'producto 2'], [3, 6]);
    //console.log(xmlDoc.getElementsByTagName("cantidad")[1].childNodes[0].nodeValue);

    //Se parsea el objeto DOM a String
    xmlString = convertToString(xmlDoc);
    //console.log(xmlString);

    //Devuelve el String generado
    return xmlString;
}

//Añade al cuerpo del mensaje el tipo Lista de la compra
function writeBodyTSC(xmlDoc, arrayIdsProducto, arrayCantidad){
    addListaCompraTSC(xmlDoc);
    
    //Añade los productos (con su id y cantidad) como hijos de listaCompra
    for(var i = 0; i < arrayIdsProducto.length; i++){
        addProductoTSC(xmlDoc, arrayIdsProducto[i], arrayCantidad[i], i);
    }

    return xmlDoc;
}

//Añade el nodo lista compra al documento xml
function addListaCompraTSC(xmlDoc){
    //Crea el nodo listaCompra y lo añade como hijo del nodo cuerpo
    var nodeListaCompra = xmlDoc.createElement("listaCompra");
    xmlDoc.getElementsByTagName("cuerpo")[0].appendChild(nodeListaCompra);
}

//Añade el nodo producto (con sus ids y cantidades correspondientes) al documento xml
function addProductoTSC(xmlDoc, idProducto, cantidad, i){
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
