<html>
<body>

<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
  Mensaje: <input type="text" name="mensaje">
  <input type="submit">
</form>

<?php

	$xml=simplexml_load_string($_POST['mensaje']);
       
    $lista_compra = $xml->cuerpo->listaCompra;

    $array_productos = array();

    foreach($lista_compra->producto as $producto) {
        $array_productos[] = (string) $producto->idProducto[0];
    }



$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hotel_de_tiendas";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$listaProductos = $array_productos;
$tienda = 1;
$disponibles = array();

foreach ($listaProductos as $producto) {
	$sql = "SELECT Cantidad, Precio FROM TIENDA_PRODUCTOS
            WHERE Id_Tienda='$tienda' AND Id_Producto = (SELECT Id_Producto FROM PRODUCTOS
                                                    WHERE Nombre_Articulo = '$producto')";

    if ($result = mysqli_query($conn, $sql)) {
    	if(mysqli_num_rows($result) > 0){
        $row = mysqli_fetch_array($result);
        $disponibles += [$producto => array($row['Cantidad'], $row['Precio'])];
        mysqli_free_result($result);
    }
	} else {
	    echo "Error obteniendo valores: " . mysqli_error($conn);
	}
}
var_dump($disponibles);

mysqli_close($conn);

$mensaje_respuesta = new XMLWriter();

    # Escribimos el inicio del mensaje
    $mensaje_respuesta->openURI("mensaje.xml");
	$mensaje_respuesta->setIndent(true);
	$mensaje_respuesta->setIndentString("\t");
    $mensaje_respuesta->startDocument('1.0', 'UTF-8');
    
    # Escribimos los atributos de la etiqueta mensaje
    $mensaje_respuesta->startElement('mensaje');
    $mensaje_respuesta->writeAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
    $mensaje_respuesta->writeAttribute('xsi:noNamespaceSchemaLocation', 'mensajeGeneral.xsd');

    # Escribimos la cabecera
    $mensaje_respuesta->setIndent(true);
    $mensaje_respuesta->startElement('cabecera');

    # Escribimos idMensaje
	$mensaje_respuesta->setIndent(true);
    $mensaje_respuesta->startElement('idMensaje');
    $mensaje_respuesta->text('1234');
    $mensaje_respuesta->endElement();

    # Escribimos identificador emisor
    $mensaje_respuesta->startElement('identificadorEmisor');
    $mensaje_respuesta->setIndent(true);
        $mensaje_respuesta->startElement('ipEmisor');
        $mensaje_respuesta->text('192.168.0.1');
        $mensaje_respuesta->endElement();

        $mensaje_respuesta->startElement('idEmisor');
        $mensaje_respuesta->text('1');
        $mensaje_respuesta->endElement();
    $mensaje_respuesta->endElement();

    # Escribimos identificador receptor
    $mensaje_respuesta->startElement('identificadorReceptor');
    $mensaje_respuesta->setIndent(true);
        $mensaje_respuesta->startElement('ipReceptor');
        $mensaje_respuesta->text('192.168.0.1');
        $mensaje_respuesta->endElement();

        $mensaje_respuesta->startElement('idReceptor');
        $mensaje_respuesta->text('1');
        $mensaje_respuesta->endElement();
    $mensaje_respuesta->endElement();

    # Escribimos tipo mensaje
    $mensaje_respuesta->startElement('tipoMensaje');
    $mensaje_respuesta->text('PRUEBA_PETICION');
    $mensaje_respuesta->endElement();

    # Escribimos fecha
    $mensaje_respuesta->startElement('fecha');
    $mensaje_respuesta->text('2019-09-24');
    $mensaje_respuesta->endElement();

    # Escribimos hora
    $mensaje_respuesta->startElement('horaEnvio');
    $mensaje_respuesta->text('11:00');
    $mensaje_respuesta->endElement();

    $mensaje_respuesta->startElement('horaRecepcion');
    $mensaje_respuesta->text('11:01');
    $mensaje_respuesta->endElement();

    # Cerramos cabecera
    $mensaje_respuesta->endElement();

    # Escribimos cuerpo
    $mensaje_respuesta->startElement('cuerpo');
    $mensaje_respuesta->writeAttribute('xsi:type','tipoTCT');
    $mensaje_respuesta->setIndent(true);

    # Escribimos litaCompra
    $mensaje_respuesta->startElement('listaCompra');

    #Escribimos productos

    foreach($disponibles as $producto => $valores) {
        $mensaje_respuesta->startElement('producto');
        $mensaje_respuesta->writeAttribute('xsi:type', 'tipoProducto');
        $mensaje_respuesta->setIndent(true);
        $mensaje_respuesta->startElement('idProducto');
        $mensaje_respuesta->text((string)$producto);
        $mensaje_respuesta->endElement();

        $mensaje_respuesta->startElement('cantidad');
        $mensaje_respuesta->text((string)$valores[0]);
        $mensaje_respuesta->endElement();

        $mensaje_respuesta->startElement('precio');
        $mensaje_respuesta->text((string)$valores[1]);
        $mensaje_respuesta->endElement();

        $mensaje_respuesta->endElement();

    }

    $mensaje_respuesta->endElement();
    $mensaje_respuesta->endElement();
    $mensaje_respuesta->endElement();

    $mensaje_respuesta->endDocument();

    echo file_get_contents("mensaje.xml");
?>

</body>
</html>
