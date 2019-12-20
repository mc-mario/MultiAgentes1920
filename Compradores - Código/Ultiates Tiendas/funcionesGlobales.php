<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
	
	class funcionesGlobales{
		
		
		#Conectamos con la BB.DD
		function conectBBDD(){
			$mysqli = new mysqli('127.0.0.1', 'admin', 'json', 'my_database')
				or die('No se pudo conectar: ' . mysql_error());
			return $mysqli;
		}
		
		#Escribimos en logs
		function logs($f, $esc){
			$file = fopen($f, "a");
				fwrite($file, $esc. PHP_EOL);
		}
		
	}

?>
