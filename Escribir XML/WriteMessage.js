//Devuelve un string con la cabecera del XML
function escribirCabecera(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, tipoMensaje){
    xmlString = 
    "<mensaje>" +
        "<cabecera>" +
            "<idMensaje>" + idMensaje + "</idMensaje>" +

            "<identificacionEmisor>" +
                "<ipEmisor>" + ipEmisor + "</ipEmisor>" +
                "<idEmisor>" + idEmisor + "</idEmisor>" +
            "</identificacionEmisor>" +

            "<identificacionReceptor>" +
                "<ipReceptor>" + ipReceptor + "</ipReceptor>" +
                "<idReceptor>" + idReceptor + "</idReceptor>" +
            "</identificacionReceptor>" +

            "<tipoMensaje>" + tipoMensaje + "</tipoMensaje>" +
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
function createXML(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, tipoMensaje){
    //Define las variables que se necesitan en la función
    var xmlDoc, xmlString, parser

    //Crea un nuevo objeto XML DOM
    xmlDoc = document.implementation.createDocument(null, "message");

    //Crea un string con la cabecera del XML
    xmlString = escribirCabecera(idMensaje, ipEmisor, idEmisor, ipReceptor, idReceptor, tipoMensaje);

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
