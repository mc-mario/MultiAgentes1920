<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
 
  
  include_once 'funcionesGlobales.php';
  include 'envios.php';
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
		function entrada($idDeTienda, $ipCliente, $idDeCliente, $cliente, $idMen, $horaEntrada, $idTiendaConocida, $ipTiendaConocida){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			#Añadimos registro de entrada del cliente
			$consult = "INSERT INTO tiendaCliente (idTienda, idCliente, idMensaje, horaMensaje, accion, productoVendido, cantidadProducto) VALUES ('$idDeTienda', '$cliente', '$idMen', '$horaEntrada', 'Dentro', NULL, NULL)";
			$mysqli -> query($consult);
			
			#hay que coger tambien las tiendas que conoce el cliente
      			foreach ($idTiendaConocida as $i => $value) {
				$idTiendaC = $idTiendaConocida[$i];
				$ipTiendaC = $ipTiendaConocida[$i];
        			$mysqli = funcionesGlobales::conectBBDD();
          			$consult2 = "INSERT INTO tiendasConocidas (ipIdCliente, idTiendaDentro, idTiendaConocida, ipTiendaConocida) VALUES ('$cliente', '$idDeTienda', '$idTiendaC', '$ipTiendaC')";

			   	$mysqli -> query($consult2);      
					
      			}
			
			#Mandamos mensaje a comprador
			envios::envioDentro($idDeTienda, $ipCliente, $idDeCliente, $idMen, $horaEntrada);
			
		}
		
		#Funcion salida de tienda
		function salida($idDeTienda, $cliente){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			funcionesGlobales::logs("logTienda.txt", "Sale la tienda: ".$cliente);
			
			#Eliminamos los registros pertenecientes a ese cliente
				$sql = "DELETE FROM tiendaCliente WHERE idCliente = '$cliente'";
				$mysqli->query($sql);	
      
      			#Eliminamos las tiendas que conoce este cliente
      			$sql = "DELETE FROM tiendasConocidas WHERE ipIdCliente = '$cliente'";
			$mysqli->query($sql);	
		}
		
		#vendemos un producto a un cliente
		function venderProducto($idDeTienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Comprobamos si el cliente esta dentro de la tienda
			$sql = "SELECT * FROM tiendaCliente WHERE idTienda LIKE '$idDeTienda' AND idCliente LIKE '$cliente' AND accion LIKE 'Dentro'";
			$result = $mysqli->query($sql);
			$row = $result->fetch_assoc();
			if($row != NULL){
				$precios = array();
				foreach ($nombreProductos as $i => $value) {
					$nombreProducto = $nombreProductos[$i];
					$cantidadP = $cantidades[$i];
					#Vemos si el producto esta disponible
					$sql = "SELECT * FROM tiendaProducto WHERE idTienda LIKE '$idDeTienda' AND idProducto LIKE '$nombreProducto' AND '$cantidadP' <= cantidad ";
					$result = $mysqli->query($sql);
					$row = $result->fetch_assoc();
					if($row != NULL){
						#Se actualiza la cantidad de la Tienda
						$cant = $row["Cantidad"];
						$nuevaCantidad = $cant - $cantidadP;
						$sql = "UPDATE tiendaProducto SET cantidad = '$nuevaCantidad' WHERE nombreProducto LIKE '$nombreProducto' AND idTienda = '$idDeTienda' ";
						$mysqli->query($sql);
						
						#Añadimos la compra
						$consult = "INSERT INTO tiendaCliente (idTienda, idCliente, idMensaje, horaMensaje, accion, productoVendido, cantidadProducto) VALUES ('$idDeTienda', '$cliente', '$idMen', '$horaEntrada', 'Compra', '$nombreProducto', '$cantidadP')";
						$mysqli -> query($consult);
						
						#Añadimos ganancias a la tienda
						$precio = $row["Precio"];
						$sql = "UPDATE tiendas SET Dinero = Dinero + ('$precio' * '$cantidadP') WHERE ID LIKE '$idDeTienda' ";
						$mysqli->query($sql);
						
						array_push($precios, ($precio * $cantidadP));
						
						#Escribimos log
						funcionesGlobales::logs("logTienda.txt", "Men: ".$idMen." -- Tienda: " .$idDeTienda. " : vende al comprador " .$cliente. " " .$cantidadP. " de " .$nombreProducto. " por " .($cantidadP * $precio). " euros");
					}
				}

				#Mandamos mensaje a comprador 
				envios::envioVenta($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios);
				
			}
			else {
				###############################################
				#Mandamos mensaje a comprador OJO FALTA ESTOOOOOOO!!!!!!!!!!!!!!!!!!!
				###############################################
				 "El comprador no esta en la tienda";
			}	
		}
		
		#pasamos una lista de productos disponibles al cliente
		function listaCompra($idDeTienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Comprobamos si el cliente esta dentro de la tienda
			$sql = "SELECT * FROM tiendaCliente WHERE idTienda LIKE '$idDeTienda' AND idCliente LIKE '$cliente' AND accion LIKE 'Dentro'";
			$result = $mysqli->query($sql);
			$row = $result->fetch_assoc();
			if($row != NULL){
				$precios = array();
				foreach ($nombreProductos as $i => $value) {
					$nombreProducto = $nombreProductos[$i];
					$cantidadP = $cantidades[$i];
					#Vemos si el producto esta disponible
					$sql = "SELECT * FROM tiendaProducto WHERE idTienda LIKE '$idDeTienda' AND idProducto LIKE '$nombreProducto' AND '$cantidadP' <= cantidad ";
					$result = $mysqli->query($sql);
					$row = $result->fetch_assoc();
					if($row != NULL){
						$precio = $row["Precio"];
						array_push($precios, ($precio * $cantidadP));
						#Escribimos log
						funcionesGlobales::logs("logTienda.txt", "Men: ".$idMen." -- Tienda: " .$idDeTienda. " : pasamos lista a " .$cliente. " " .$cantidadP. " de " .$nombreProducto. " por " .($cantidadP * $precio). " euros");
					}
									
				}
				#Mandamos mensaje a comprador 
				envios::envioLista($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios);
				
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
		function dameTienda($tienda, $cliente, $ipCliente, $idCliente, $idMen, $horaEntrada){
			$mysqli = funcionesGlobales::conectBBDD();
			$sql = "SELECT ipTiendaConocida FROM tiendasConocidas";
                        $ipResult = $mysqli->query($sql);
			$mysqli = funcionesGlobales::conectBBDD();
                        $sql = "SELECT idTiendaConocida FROM tiendasConocidas";
                        $idResult = $mysqli->query($sql);
			$mysqli = funcionesGlobales::conectBBDD();
                        $sql = "SELECT ipIdCliente FROM tiendasConocidas";
                        $compradorResult = $mysqli->query($sql);
                        
			$ipResultArray = array();
			$idResultArray = array();
      $compradores = array();
			while($row = mysqli_fetch_assoc($ipResult)){
				$ipResultArray[] = $row["ipTiendaConocida"];
			}
      while($row = mysqli_fetch_assoc($compradorResult)){
				$compradores[] = $row["ipIdCliente"];
			}
			while($row = mysqli_fetch_assoc($idResult)){
                                $idResultArray[] = $row["idTiendaConocida"];
                        }
			envios::envioTienda($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $ipResultArray, $idResultArray, $compradores);
		}
	}
?>
