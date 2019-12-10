<?php set_time_limit(120);
error_reporting(E_ALL ^ E_DEPRECATED);
	include 'Tienda.php';
	include_once 'funcionesGlobales.php';

  	#Constructor
	class Inicializador
	{
		function __construct(){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();

			#Creamos tabla tiendas
			$result = $mysqli->query("CREATE TABLE tiendas (Id INT(20), dinero INT(20))");
			funcionesGlobales::logs("logInicializacion.txt", "Conectado a la Base de Datos.");

			#Introducimos datos a las tiendas
			for($i = 0; $i < 10; ++$i) {
				$result = $mysqli->query("INSERT INTO tiendas (Id, dinero) VALUES ($i, 0)");
			}

			#Creamos tabla productos
			$result = $mysqli->query("CREATE TABLE productos (Id INT(20), Nombre VARCHAR(20), Cantidad INT(20), Precio INT(20))");

			#Introducimos datos a los productos
			for($i = 0; $i < 100; ++$i) {
				$result = $mysqli->query("INSERT INTO productos (Id, Nombre, Cantidad, Precio) VALUES ($i, 'product$i', 30, 2)");
			}

			#Creamos tabla para la relaccion entre productos y tienda
			$sql = "CREATE TABLE tiendaProducto (idTienda INT(6), idProducto INT(6), nombreProducto varchar(50), Precio INT(6), Cantidad INT(50))";
			$mysqli->query($sql);

			#Creamos tabla para la relacion entre tienda y cliente
			$sql = "CREATE TABLE tiendaCliente (idTienda VARCHAR(20), idCliente VARCHAR(20), idMensaje INT(9), horaMensaje VARCHAR(10), accion varchar(50), productoVendido varchar(50), cantidadProducto INT(10))";
			$mysqli->query($sql);

			#Inicializamos las tiendas
			$res = $mysqli->query("SELECT Id FROM tiendas");
			$f=0;
			while($f < 10){
				funcionesGlobales::logs("logInicializacion.txt", "Creamos la tienda: ".$f);
				$workers[$f] = new Tienda($f);
				proveer($f);
				echo "Creamos tienda " .$f.' <br/>';
				$f = $f +1;

			}
			echo "Se completa el inicio";

		}


	}
	function proveer($id){

		#Conectamos con BB.DD
		$mysqli = funcionesGlobales::conectBBDD();

		for ($i=0; $i< random_int(100, 150); $i++){
			#Sacamos un Id aleatorio de los productos
			$result = $mysqli->query("SELECT Id FROM productos");
			$cantProductos =(int) $result -> num_rows;
			echo $cantProductos;
			$IDRandom = random_int(0, ($cantProductos-1));
			#Seleccionamos cantidad aleatoria del producto y sus datos
			$result2 = $mysqli->query("SELECT * FROM productos WHERE Id LIKE ".$IDRandom);
			$row = $result2->fetch_assoc();
			$cantidadEnTienda = random_int(10,30); #Obtenemos la cantidad de productos para la tienda 
			$nr = $row["Nombre"]; #Obtenemos nombre del producto
			$pr = $row["Precio"]; #Obtenemos el precio del producto

			#Comprobamos si el producto elegido ya esta en la tienda
			$sql = "SELECT * FROM tiendaProducto WHERE idProducto LIKE '$IDRandom' AND idTienda = '$id' ";
			$result = $mysqli->query($sql);
			$row = $result->fetch_assoc();
			if ($row != NULL){ #Si esta en la tienda solo aumentamos su cantidad
				$cant = $row["Cantidad"];
				$nuevaCantidad = $cant + $cantidadEnTienda;
				$sql = "UPDATE tiendaProducto
							SET Cantidad = '$nuevaCantidad'
							WHERE idProducto LIKE '$IDRandom' AND idTienda = '$id' ";
				$mysqli->query($sql);
			}
			else{ #Si no esta en la tienda creamos la nueva relacion entre tiedna producto
				#Introducimos los datos
				$sql2 = "INSERT INTO tiendaProducto (idTienda, idProducto, nombreProducto, precio, cantidad) VALUES ('$id', '$IDRandom', '$nr', '$pr', '$cantidadEnTienda')";
				$mysqli->query($sql2);
			}

			#Escribimos en log
			#funcionesGlobales::logs("logInicializacion.txt", "Añadimos a la tienda: ".$id. " el producto ".$nr. ", cantidad: ".$cantidadEnTienda);
		}


	}

	#Creamos el objeto inicializador
	$obj = new Inicializador();

?>
