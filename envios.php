<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	
class envios{
		
	function envioVenta($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios){
		
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
		$tipoMensaje = $ventas->cabecera->addChild('tipoMensaje', 'TPV');
		
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
	
	function envioDentro($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada){
		
		$dentro = simplexml_load_file('D:\xampp\htdocs\mensajes\Dentro.xml');
		
		#idMensaje
		$idMensaje = $dentro->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $dentro->cabecera->identificacionEmisor->addChild('ipEmisor', $_SERVER['REMOTE_ADDR']);
		$idEmisor = $dentro->cabecera->identificacionEmisor->addChild('idEmisor', $idDeTienda);
		
		#Receptor
		$ipReceptor = $dentro->cabecera->identificacionReceptor->addChild('ipReceptor', $ipCliente);
		$idReceptor = $dentro->cabecera->identificacionReceptor->addChild('idReceptor', $idCliente);
		
		#TipoMensaje
		$tipoMensaje = $dentro->cabecera->addChild('tipoMensaje', 'TAAT');
		
		#Horas
		$horaEnvio = $dentro->cabecera->addChild('horaEnvio', '00:00');
		$horaRecepcion = $dentro->cabecera->addChild('horaRecepcion', '00:01');
		
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