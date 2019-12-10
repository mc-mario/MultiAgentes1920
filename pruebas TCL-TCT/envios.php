<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	
class envios{
		
	function envioVenta($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios){
		$mensaje_respuesta = new XMLWriter();

    # Escribimos el inicio del mensaje
    $mensaje_respuesta->openURI("Ventas.xml");
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
	}
	
	function envioDentro($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada){
		
	$mensaje_respuesta = new XMLWriter();

    # Escribimos el inicio del mensaje
    $mensaje_respuesta->openURI("Dentro.xml");
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
    $mensaje_respuesta->writeAttribute('xsi:type','tipoTAAT');
    $mensaje_respuesta->setIndent(true);


    $mensaje_respuesta->endElement();
    $mensaje_respuesta->endElement();
    $mensaje_respuesta->endElement();

    $mensaje_respuesta->endDocument();
	
	echo file_get_contents("mensaje.xml");
		
	}
	
	function envioCoincidencia($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios){
		
		$ventas = simplexml_load_file('D:\xampp\htdocs\mensajes\Ventas.xml');
		
		#idMensaje
		$idMensaje = $ventas->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $ventas->cabecera->identificacionEmisor->addChild('ipEmisor', $_SERVER['REMOTE_ADDR']);
		$idEmisor = $ventas->cabecera->identificacionEmisor->addChild('idEmisor', $idDeTienda);
		
		#Receptor
		$ipReceptor = $ventas->cabecera->identificacionReceptor->addChild('ipReceptor', $ipCliente);
		$idReceptor = $ventas->cabecera->identificacionReceptor->addChild('idReceptor', $idCliente);
		
		#TipoMensaje
		$tipoMensaje = $ventas->cabecera->addChild('tipoMensaje', 'TCT');
		
		#Horas
		$horaEnvio = $ventas->cabecera->addChild('horaEnvio', '00:00');
		$horaRecepcion = $ventas->cabecera->addChild('horaRecepcion', '00:01');
		
		#Lista productos
		foreach ($precios as $z => $value) {
			if ($precios[$z] != 0){
				$producto[$z] = $ventas->cuerpo->listaCompra->addChild('producto');
				$nombre = $ventas->cuerpo->listaCompra->producto[$z]->addChild('idProducto', $nombreProductos[$z]);
				$cantidad = $ventas->cuerpo->listaCompra->producto[$z]->addChild('cantidad', $cantidades[$z]);
				$precio = $ventas->cuerpo->listaCompra->producto[$z]->addChild('precio', $precios[$z]);
			}
		}
	}
}
?>