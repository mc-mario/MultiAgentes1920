<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

class envios{
	function envioVenta($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios){
		
		$ventas = simplexml_load_file('/var/www/html/mensajes/Ventas.xml');
		
		#idMensaje
		$idMensaje = $ventas->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $ventas->cabecera->identificacionEmisor->addChild('ipEmisor', "63.33.189.149");
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
		echo $ventas->asXML();
	}
	
	function envioDentro($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada){
		$dentro = simplexml_load_file('/var/www/html/mensajes/Dentro.xml');
		
		#idMensaje
		$idMensaje = $dentro->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $dentro->cabecera->identificacionEmisor->addChild('ipEmisor', '63.33.189.149');
		$idEmisor = $dentro->cabecera->identificacionEmisor->addChild('idEmisor', $idDeTienda);
		
		#Receptor
		$ipReceptor = $dentro->cabecera->identificacionReceptor->addChild('ipReceptor', $ipCliente);
		$idReceptor = $dentro->cabecera->identificacionReceptor->addChild('idReceptor', $idCliente);
		
		#TipoMensaje
		$tipoMensaje = $dentro->cabecera->addChild('tipoMensaje', 'TAAT');
		
		#Horas
		$horaEnvio = $dentro->cabecera->addChild('horaEnvio', '00:00');
		$horaRecepcion = $dentro->cabecera->addChild('horaRecepcion', '00:01');

		echo $dentro->asXML();
	}
 
 function envioTienda($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $ipTiendas, $idTiendas, $compradores){
		
		$tiendas = simplexml_load_file('/var/www/html/mensajes/Tiendas.xml');
		
		#idMensaje
		$idMensaje = $tiendas->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $tiendas->cabecera->identificacionEmisor->addChild('ipEmisor', "63.33.189.149");
		$idEmisor = $tiendas->cabecera->identificacionEmisor->addChild('idEmisor', $idDeTienda);
		
		#Receptor
		$ipReceptor = $tiendas->cabecera->identificacionReceptor->addChild('ipReceptor', $ipCliente);
		$idReceptor = $tiendas->cabecera->identificacionReceptor->addChild('idReceptor', $idCliente);
		
		#TipoMensaje
		$tipoMensaje = $tiendas->cabecera->addChild('tipoMensaje', 'TTT');
		
		#Horas
		$horaEnvio = $tiendas->cabecera->addChild('horaEnvio', '00:00');
		$horaRecepcion = $tiendas->cabecera->addChild('horaRecepcion', '00:01');
		
		foreach ($idTiendas as $z => $value) {
                       $tienda[$z] = $tiendas->cuerpo->addChild('direccion');
                       $ipTienda = $tiendas->cuerpo->direccion[$z]->addChild('comprador', $compradores[$z]);
                       $ipTienda = $tiendas->cuerpo->direccion[$z]->addChild('ip', $ipTiendas[$z]);
                       $idTienda = $tiendas->cuerpo->direccion[$z]->addChild('id', $idTiendas[$z]);
                       
                }

		
		echo $tiendas->asXML();
	}
 
 function envioLista($idDeTienda, $ipCliente, $idCliente, $idMen, $hora, $nombreProductos, $cantidades, $precios){
		
		$lista = simplexml_load_file('/var/www/html/mensajes/Lista.xml');
		
		#idMensaje
		$idMensaje = $lista->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $lista->cabecera->identificacionEmisor->addChild('ipEmisor', "63.33.189.149");
		$idEmisor = $lista->cabecera->identificacionEmisor->addChild('idEmisor', $idDeTienda);
		
		#Receptor
		$ipReceptor = $lista->cabecera->identificacionReceptor->addChild('ipReceptor', $ipCliente);
		$idReceptor = $lista->cabecera->identificacionReceptor->addChild('idReceptor', $idCliente);
		
		#TipoMensaje
		$tipoMensaje = $lista->cabecera->addChild('tipoMensaje', 'TCT');
		
		#Horas
		$horaEnvio = $lista->cabecera->addChild('horaEnvio', $hora);
		$horaRecepcion = $lista->cabecera->addChild('horaRecepcion', '00:01');
		
		#Lista productos
		foreach ($precios as $z => $value) {
			if ($precios[$z] != 0){
				$producto[$z] = $lista->cuerpo->listaCompra->addChild('producto');
				$nombre = $lista->cuerpo->listaCompra->producto[$z]->addChild('idProducto', $nombreProductos[$z]);
				$cantidad = $lista->cuerpo->listaCompra->producto[$z]->addChild('cantidad', $cantidades[$z]);
				$precio = $lista->cuerpo->listaCompra->producto[$z]->addChild('precio', $precios[$z]);
			}
		}
		echo $lista->asXML();
	}
}
?>
