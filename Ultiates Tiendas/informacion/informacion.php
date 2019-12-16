<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Newline CSS Template with a video background</title>
	<!-- Refrescar auto la pagina -->
	<!-- <META HTTP-EQUIV="REFRESH" CONTENT="3;URL=informacion.php"> -->

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/fontAwesome.css">
        <link rel="stylesheet" href="css/templatemo-style.css">

        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900" rel="stylesheet">

        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
    </head>
    <body>
        <div class="overlay"></div>
        <section class="top-part">
          <video controls autoplay loop>
                      Your browser does not support the video tag.
          </video>
        </section>
        
        <section class="cd-hero">

          <div class="cd-slider-nav">
            <nav>
              <span class="cd-marker item-1"></span>
              <ul>
                <li onclick="location.href='http://63.33.189.149/informacion/index.html'"><a href="#0"><div class="image-icon"><img src="img/home-icon.png"></div><h6>Updates</h6></a></li>
               <!-- <li><a href="#0" onclick="location.href='http://63.33.189.149/informacion/problemas.html'"><div class="image-icon"><img src="img/featured-icon.png"></div><h6>Problemas</h6></a></li> -->
                <li class="selected"><a href="#0"><div class="image-icon"><img src="img/projects-icon.png"></div><h6>Informacion</h6></a></li>
              </ul>
            </nav> 
          </div> <!-- .cd-slider-nav -->

          
		<li>
              <div class="heading">
                <h1>Informacion</h1>
                <span>Informacion en tiempo real sobre las operaciones tiendas-clientes</span> 
              </div>
              <div class="cd-half-width third-slide">
                <div class="container">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="content third-content">
                        <div class="row">
			  <div class="col-md-7 left-image">
                          <h4>Interaccion Tienda-Cliente</h4>
                              
                              <div class="feature-list">
                                <ul>
				<?php
                                   function displayTable3(){

                                                 //Creamos la conexiÃƒÂ³n
                                                $mysqli = new mysqli('127.0.0.1', 'admin', 'json', 'my_database')
                                                        or die('No se pudo conectar: ' . mysql_error());
                                                 //generamos la consulta
                                                $sql = "SELECT * FROM tiendaCliente";
                                                $result = $mysqli->query($sql);
                                                $row = $result->fetch_assoc();
						
                                                $rawdata = array();
                                                //guardamos en un array multidimensional todos los datos de la consulta
                                                $i=0;

                                                while($row = mysqli_fetch_array($result))
                                                {
                                                        $rawdata[$i] = $row;
						
                                                        $i++;
                                                }

                                                $close = mysqli_close($mysqli);

                                                 //DIBUJAMOS LA TABLA
						 echo '<table width="100%" border="1" style="text-align:center;">';
                                                $columnas = count($rawdata[0])/2;
                                                //echo $columnas;
                                                $filas = count($rawdata);
                                                //echo "<br>".$filas."<br>";

                                                //AÃƒÂ±adimos los titulos

                                                for($i=1;$i<count($rawdata[0]);$i=$i+2){
                                                        next($rawdata[0]);
                                                        echo "<th><b>".key($rawdata[0])."</b></th>";
                                                        next($rawdata[0]);
                                                }

                                                for($i=0;$i<$filas;$i++){

                                                        echo "<tr>";
                                                        for($j=0;$j<$columnas;$j++){
                                                                echo "<td>".$rawdata[$i][$j]."</td>";

                                                        }
                                                        echo "</tr>";
                                                }

                                                        echo '</table>';

                                                }

                                                displayTable3();
                                        ?>
                                </ul>
                              </div>
			   </div>
                          <div class="col-md-5">
                            <div class="right-feature-text">
                              <h4>Tiendas abiertas </h4>
                              
                              <div class="feature-list">
                                <ul>
				<?php
                                   function displayTable(){

                                                 //Creamos la conexiÃ³n
                                                $mysqli = new mysqli('127.0.0.1', 'admin', 'json', 'my_database')
                                                        or die('No se pudo conectar: ' . mysql_error());
                                                 //generamos la consulta
                                                $sql = "SELECT * FROM tiendas";
                                                $result = $mysqli->query($sql);
                                                $row = $result->fetch_assoc();

                                                $rawdata = array();
                                                //guardamos en un array multidimensional todos los datos de la consulta
                                                $i=0;

                                                while($row = mysqli_fetch_array($result))
                                                {
                                                        $rawdata[$i] = $row;
                                                        $i++;
                                                }

                                                $close = mysqli_close($mysqli);

                                                 //DIBUJAMOS LA TABLA
						 echo '<table width="100%" border="1" style="text-align:center;">';
                                                $columnas = count($rawdata[0])/2;
                                                //echo $columnas;
                                                $filas = count($rawdata);
                                                //echo "<br>".$filas."<br>";

                                                //AÃ±adimos los titulos

                                                for($i=1;$i<count($rawdata[0]);$i=$i+2){
                                                        next($rawdata[0]);
                                                        echo "<th><b>".key($rawdata[0])."</b></th>";
                                                        next($rawdata[0]);
                                                }

                                                for($i=0;$i<$filas;$i++){

                                                        echo "<tr>";
                                                        for($j=0;$j<$columnas;$j++){
                                                                echo "<td>".$rawdata[$i][$j]."</td>";

                                                        }
                                                        echo "</tr>";
                                                }

                                                        echo '</table>';

                                                }

                                                displayTable();
                                        ?>
                                </ul>
                              </div>
				<h4>Productos en las Tiendas</h4>
                              
                              <div class="feature-list">
                                <ul>
				<?php
                                   function displayTable2(){

                                                 //Creamos la conexiÃƒÂ³n
                                                $mysqli = new mysqli('127.0.0.1', 'admin', 'json', 'my_database')
                                                        or die('No se pudo conectar: ' . mysql_error());
                                                 //generamos la consulta
                                                $sql = "SELECT * FROM tiendaProducto";
                                                $result = $mysqli->query($sql);
                                                $row = $result->fetch_assoc();

                                                $rawdata = array();
                                                //guardamos en un array multidimensional todos los datos de la consulta
                                                $i=0;

                                                while($row = mysqli_fetch_array($result))
                                                {
                                                        $rawdata[$i] = $row;
                                                        $i++;
                                                }

                                                $close = mysqli_close($mysqli);

                                                 //DIBUJAMOS LA TABLA
						 echo '<table width="100%" border="1" style="text-align:center;">';
                                                $columnas = count($rawdata[0])/2;
                                                //echo $columnas;
                                                $filas = count($rawdata);
                                                //echo "<br>".$filas."<br>";

                                                //AÃƒÂ±adimos los titulos

                                                for($i=1;$i<count($rawdata[0]);$i=$i+2){
                                                        next($rawdata[0]);
                                                        echo "<th><b>".key($rawdata[0])."</b></th>";
                                                        next($rawdata[0]);
                                                }

                                                for($i=0;$i<$filas;$i++){

                                                        echo "<tr>";
                                                        for($j=0;$j<$columnas;$j++){
                                                                echo "<td>".$rawdata[$i][$j]."</td>";

                                                        }
                                                        echo "</tr>";
                                                }

                                                        echo '</table>';

                                                }

                                                displayTable2();
                                        ?>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>                  
                </div>
              </div>
            </li>

            
</section> <!-- .cd-hero -->


        <footer>
          <p>Copyright &copy; Clases de API 
                                
        	| Diseñado por: <em>Usuarios</em></p>
        </footer>
    
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>

        <script src="js/vendor/bootstrap.min.js"></script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>

    </body>
</html>
