/* TIPO SOLICITUD ACCESO a TIENDA */

function writeMessageTSAT(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, arrayTiendas){
    //Crea un XML con la cabecera generada
    var xmlDoc = createXML(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, 'TSAT');

    //Añade el cuerpo del XML
    writeBodyTSAT(xmlDoc, arrayTiendas);

    //Devuelve el XML generado
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
