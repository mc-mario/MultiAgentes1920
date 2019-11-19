<?php
  
  
  include_once 'funcionesGlobales.php';
  include 'envios.php';
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	
  class Tienda extends funcionesGlobales
	{
	
  	#Atributos
		var $id ;
			
		#Constructor
		function __construct($i){
			$this->id=$i;
			
			#Escribimos en el log
			funcionesGlobales::logs("logTienda.txt", "Abrimos una nueva tienda con identificador: " .$this->id);
			
		}
		
		#Funcion para entrar a la tienda 
		function entrada($idDeTienda, $ipCliente, $idDeCliente, $cliente, $idMen, $horaEntrada){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			#Añadimos registro de entrada del cliente
			$consult = "INSERT INTO tiendacliente (idTienda, idCliente, idMensaje, horaMensaje, accion, productoVendido, cantidadProducto) VALUES ('$idDeTienda', '$cliente', '$idMen', '$horaEntrada', 'Dentro', NULL, NULL)";
			$mysqli -> query($consult);
			funcionesGlobales::consultaTiendaCliente('insert', $idDeTienda, $cliente, $idMen, $horaEntrada, 'Dentro', NULL, NULL);
			#hay que coger tambien las tiendas que conoce el cliente
			
			#Mandamos mensaje a comprador
			envios::envioDentro($idDeTienda, $ipCliente, $idDeCliente, $idMen, $horaEntrada);
			
		}
		
		#Funcion salida de tienda
		function salida($idDeTienda, $idDeCliente){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Buscamos en BB.DD registro de entrada
			$result = $mysqli->query("SELECT * FROM tiendacliente WHERE idCliente LIKE '$idDeCliente' AND accion LIKE 'Dentro' "); 
			$row = $result->fetch_assoc();
			
			#Eliminamos los registros pertenecientes a ese cliente
			if($row != NULL){
				$sql = "DELETE FROM tiendacliente WHERE idCliente = '$idDeCliente'";
				$mysqli->query($sql);	
			}
		}
		
		#vendemos un producto a un cliente
		function venderProducto($idDeTienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Comprobamos si el cliente esta dentro de la tienda
			$sql = "SELECT * FROM tiendacliente WHERE idTienda LIKE '$idDeTienda' AND idCliente LIKE '$cliente' AND accion LIKE 'Dentro'";
			$result = $mysqli->query($sql);
			$row = $result->fetch_assoc();
			var_dump($row);
			if($row != NULL){
				$precios = array();
				foreach ($nombreProductos as $i => $value) {
					$nombreProducto = $nombreProductos[$i];
					$cantidadP = $cantidades[$i];
					#Vemos si el producto esta disponible
					$sql = "SELECT * FROM tiendaproducto WHERE idTienda LIKE '$idDeTienda' AND nombreProducto LIKE '$nombreProducto' AND '$cantidadP' <= cantidad ";
					$result = $mysqli->query($sql);
					$row = $result->fetch_assoc();
					if($row != NULL){
						#Se actualiza la cantidad de la Tienda
						$cant = $row["Cantidad"];
						$nuevaCantidad = $cant - $cantidadP;
						$sql = "UPDATE tiendaProducto
									SET cantidad = '$nuevaCantidad'
									WHERE nombreProducto LIKE '$nombreProducto' AND idTienda = '$idDeTienda' ";
						$mysqli->query($sql);
						
						#Añadimos la compra
						$consult = "INSERT INTO tiendacliente (idTienda, idCliente, idMensaje, horaMensaje, accion, productoVendido, cantidadProducto) VALUES ('$idDeTienda', '$cliente', '$idMen', '$horaEntrada', 'Compra', '$nombreProducto', '$cantidadP')";
						$mysqli -> query($consult);
						
						#Añadimos ganancias a la tienda
						$precio = $row["Precio"];
						$sql = "UPDATE tiendas
									SET Dinero = Dinero + ('$precio' * '$cantidadP')
									WHERE ID LIKE '$idDeTienda' ";
						$mysqli->query($sql);
						
						array_push($precios, ($precio * $cantidadP));
						
						#Escribimos log
						funcionesGlobales::logs("logTienda.txt", "Men: ".$idMen." -- Tienda: " .$idDeTienda. " : vende al comprador " .$cliente. " " .$cantidadP. " de " .$nombreProducto. " por " .($cantidadP * $precio). " euros");
					}
					else{
						array_push($precios, 0);
						echo "Producto: ".$nombreProducto." no disponible <br/>";
					}
				}

				#Mandamos mensaje a comprador 
				envios::envioVenta($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios);
				
			}
			else {
				###############################################
				#Mandamos mensaje a comprador OJO FALTA ESTOOOOOOO!!!!!!!!!!!!!!!!!!!
				###############################################
				echo "El comprador no esta en la tienda";
			}	
		}
		
		#Funcion para cerrar la tienda 
		function cerrar($a){
			
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Eliminamos la relacion entre producto-tienda y cliente-tienda
			$sql = "DELETE FROM tiendaProducto WHERE idTienda = '$a'";
			$mysqli->query($sql);
			
			$sql = "DELETE FROM tiendacliente WHERE idTienda = '$a'";
			$mysqli->query($sql);
			
			#Escribimos en el log
			funcionesGlobales::logs("logTienda.txt", "Cerramos la tienda con identificador: " .$a);
		}
		
		#Dar las tiendas que conocen los demas clientes
		function dameTienda($a){
			###############################################
			#Mandamos mensaje a comprador OJO FALTA ESTOOOOOOO!!!!!!!!!!!!!!!!!!!
			###############################################
		}
	}
?>