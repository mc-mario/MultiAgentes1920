<?php

  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
  header("Allow: GET, POST, OPTIONS, PUT, DELETE");

	
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
			$tienda = $msg->cabecera->identificacionReceptor->idReceptor;
			$result = $mysqli->query("SELECT * FROM tiendaProducto WHERE idTienda LIKE ".$tienda); 
			$row = $result ->fetch_assoc();
			
			#Llamamos al metodo de tienda dependiendo de la accion que quiere realizar el cliente
			if($row != NULL){
				#Sacamos informacion del mensaje
				$ipCliente = $msg->cabecera->identificacionEmisor->ipEmisor;
				$idCliente = $msg->cabecera->identificacionEmisor->idEmisor;
				$cliente = $ipCliente."-".$idCliente;
				$idMen = $msg->cabecera->idMensaje;  
				$tipoDeMensaje = $msg->cabecera->tipoMensaje; 
				$horaEntrada = $msg -> cabecera-> horaEnvio;
				
			#entrar/salir de la tienda ----------------------------------------------------------------------------------------- 
				if(strcmp($tipoDeMensaje, 'TSAT') === 0){
					$ConDes = $msg->cuerpo->protocolo;
					if(strcmp($ConDes, 'CONEXION') === 0){

						$idTiendas = array(); # arrays para la lista de tiendas que conoce
						$ipTiendas = array();

						foreach ($msg->cuerpo->listaTiendas->tienda as $tiendas){
							array_push($idTiendas, $tiendas->id);
							array_push($ipTiendas, $tiendas->ip);
						}
						Tienda::entrada($tienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $idTiendas, $ipTiendas);
						#Escribimos log
						funcionesGlobales::logs("logHotel.txt", "Tienda: " .$tienda. " : entra el comprador: " .$cliente);

					#Salir de tienda -------------------------------------------------------------------------------------------
					}elseif (strcmp($ConDes, 'DESCONEXION') === 0){
						Tienda::salida($tienda, $cliente);
						#Escribimos log
						funcionesGlobales::logs("logHotel.txt", "Men: ".$idMen." -- Tienda: " .$tienda. " : sale el comprador: " .$cliente);
					}                                      
				#Comprar en tienda --------------------------------------------------------------------------------------
				}elseif (strcmp($tipoDeMensaje, 'TSC') === 0){
					$nombreProductos = array(); #Array para los productos que nos piden
					$cantidades = array();
					foreach ($msg->cuerpo->listaCompra->producto as $producto){ #Rellenamos arrays
						array_push($nombreProductos, $producto->idProducto);
						array_push($cantidades, $producto->cantidad);
					}
					Tienda::venderProducto($tienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades); #Llamamos a la tienda con la venta
                                          
				#Pedir lista de compra -----------------------------------------------------------------------------------
				}elseif (strcmp($tipoDeMensaje, 'TLC') === 0){
					$nombreProductos = array(); #Array con los productos que nos piden
					$cantidades = array();
					foreach ($msg->cuerpo->listaCompra->producto as $producto){ #Rellenamos arrays
						array_push($nombreProductos, $producto->idProducto);
						array_push($cantidades, $producto->cantidad);
					}
					Tienda::listaCompra($tienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades); #Llamamos a la tienda con la lista de la compra
				
        #Pedir otras tiendas -------------------------------------------------------------------------------------
				}elseif (strcmp($tipoDeMensaje, 'TDOT') === 0){
					Tienda::dameTienda($tienda, $cliente, $ipCliente, $idCliente, $idMen, $horaEntrada); #Llamamos a la tienda para que le pase las tiendas que conocen los demas clientes
				}
			}
			#Si la tienda no está abierta
			else {
				echo "La tienda no existe";
			}	
		}

	#leemos y parseamos el mensaje del cliente
	$xml = simplexml_load_string($_POST["mensaje"]);
	
	#Creamos un objeto hotelTienda
	$obj = new hotelTienda($xml);
?>
