<?php

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	
	echo '<?xml version="1.0" encoding="UTF-8"?>

<mensaje xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="mensajeGeneral.xsd">

	<!-- CABECERA -->
	<cabecera>
	
		<!-- Identificador del mensaje -->
		<idMensaje>1234</idMensaje>
		
		<!-- Identificador del emisor (dividido en IP e ID) -->
		<identificacionEmisor>
			<ipEmisor>192.168.0.1</ipEmisor>
			<idEmisor>1</idEmisor>
		</identificacionEmisor>
		
		<!-- Identificador del receptor (dividido en IP e ID) -->
		<identificacionReceptor>
			<ipReceptor>192.168.0.1</ipReceptor>
			<idReceptor>1</idReceptor>
		</identificacionReceptor>
		
		<!-- Tipo del mensaje -->
		<tipoMensaje>comprar</tipoMensaje>
		
		<!-- Fecha del mensaje -->
		<fecha>2019-09-24</fecha>
		
		<!-- Hora de envio -->
		<horaEnvio>11:00:00</horaEnvio>
		
		<!-- Hora de recepción -->
		<horaRecepcion>11:00:01</horaRecepcion>
		
	</cabecera>
	
	<!-- CUERPO -->
	<!-- NOTA: Importante xsi:type para indicar el tipo de cuerpo que espera. -->
	<cuerpo xsi:type="tipoCuerpoPRUEBA_PETICION">
	  <listaCompra>
			<producto>
				<idProducto>product79</idProducto>
				<cantidad>3</cantidad>
			</producto>
			<producto>
				<idProducto>product69</idProducto>
				<cantidad>2</cantidad>
			</producto>
	  </listaCompra>
	</cuerpo>
	
</mensaje>';
	
?>