<?php

	header('Access-Control-Allow-Origin: *');
	 header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
 	 header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
  	header("Allow: GET, POST, OPTIONS, PUT, DELETE");

	$ventas = simplexml_load_file('/var/www/html/pruebaxml.xml');
	//var_dump($ventas);
	echo $ventas->asXML();
?>
