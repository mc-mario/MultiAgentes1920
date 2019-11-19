<?php

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
		
	include 'Tienda.php';
	include_once 'funcionesGlobales.php';
	
	class hotelTienda {
		#Construimos el hotel
		function __construct($msg){
			redireccionTienda($msg);
		}	
	}
	
	#Desglosamos y pasamos el mensaje a la tienda 
	function redireccionTienda($msg){ 
	
			#Conectamos a BB.DD
			$mysqli = funcionesGlobales::conectBBDD();

			#Vemos si la tienda esta disponible
			$tienda = "".$msg->cabecera->identificacionReceptor->idReceptor;
			$result = $mysqli->query("SELECT * FROM tiendaproducto WHERE idTienda LIKE ".$tienda); 
			$row = $result ->fetch_assoc();
			
			#Llamamos al metodo de tienda dependiendo de la accion que quiere realizar el cliente
			if($row != NULL){
				#Sacamos informacion del mensaje
				$ipCliente = $msg->cabecera->identificacionReceptor->ipReceptor;
				$idCliente = $msg->cabecera->identificacionEmisor->idEmisor;
				$cliente = $ipCliente."-".$idCliente;
				$idMen = $msg->cabecera->idMensaje;  
				$tipoDeMensaje = $msg->cabecera->tipoMensaje; 
				$horaEntrada = $msg -> cabecera-> horaEnvio;
				
				#entrar a tienda
				if(strcmp($tipoDeMensaje, 'TSAT') === 0){
					Tienda::entrada($tienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada);
					#Escribimos log
					funcionesGlobales::logs("logHotel.txt", "Tienda: " .$tienda. " : entra el comprador: " .$cliente);
				#Salir de tienda
				}elseif (strcmp($tipoDeMensaje, 'salir') === 0){
					Tienda::salida($tienda, $cliente);
					#Escribimos log
					funcionesGlobales::logs("logHotel.txt", "Men: ".$idMen." -- Tienda: " .$tienda. " : sale el comprador: " .$cliente);
				#Comprar en tienda
				}elseif (strcmp($tipoDeMensaje, 'TSC') === 0){
					$nombreProductos = array();
					$cantidades = array();
					foreach ($msg->cuerpo->listaCompra->producto as $producto){
						array_push($nombreProductos, $producto->idProducto);
						array_push($cantidades, $producto->cantidad);
					}
					Tienda::venderProducto($tienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades);
				#TIPO LISTA DE LA COMPRA	
				}elseif (strcmp($tipoDeMensaje, 'TLC') === 0){
					$nombreProductos = array();
					$cantidades = array();
					foreach ($msg->cuerpo->listaCompra->producto as $producto){
						array_push($nombreProductos, $producto->idProducto);
						array_push($cantidades, $producto->cantidad);
					}
					Tienda::venderProducto($tienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades);
				#Pedir otras tiendas	
				}elseif (strcmp($tipoDeMensaje, 'TDOT') === 0){
					
				}
			}
			#Si la tienda no está abierta
			else {
				echo "La tienda no existe";
			}	
		}

	#leemos y parseamos el mensaje del cliente
	if(!$xml = simplexml_load_file($_POST["mensaje"])){
		echo "No se ha podido cargar el archivo";
	} else {
		echo "El archivo se ha cargado correctamente <br/>";
	}
	
	#Creamos un objeto hotelTienda
	$obj = new hotelTienda($xml);
?>