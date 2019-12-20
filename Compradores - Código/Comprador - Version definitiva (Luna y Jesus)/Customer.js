//JESUS ANDRES FERNANDEZ
//Ultima modificacion: 09/12/19
//Version: 6.0

class Customer {
	
	//Constructor de la clase cliente
    constructor(number, totalProduct, customerProduct, shopPerIP, hotelReference) {
		
		//VALORES A MODIFICAR MANUALMENTE
		////////////////////////////////

		//LISTA DE IPS Y PUERTO
		this.shopIPList = ["63.33.189.149"];
		this.port = "80";

		//IP DE LA MÁQUINA LOCAL
		this.ip = "161.67.197.15";

		//DIRECCIÓN DEL HOTEL DE TIENDAS
		this.hotelHost = "hotelTienda.php";

		//TIEMPO DE TIMEOUT EN LOS MENSAJES
		this.messageTimeout = 5000;

		//MODO DEBUG
		this.debug = false;

		////////////////////////////////

		//Da nombre al cliente y genera su lista de productos, su lista de tiendas conocidas e inicializa el log
		this.id = number + 1;
		this.productList = this.generateProductList(totalProduct, customerProduct);
		this.knownShops = this.generateShopList(2, this.shopIPList, shopPerIP);
		this.log = [];
		
		//Inicializa la información a mostrar en el monitor HTTP
		this.shop = null;
		var date = new Date();
		this.startHour = date.toISOString().substr(11, 8) + ":" +  date.getMilliseconds();
		this.endHour = "None";
		this.messages = 0;

		//Dinero gastado
		this.money = 0;

		//Lista temporal de precios
		this.precios = [];

		//Referencia al hotel
		this.hotel = hotelReference;
		
    }
	
	//Metodo principal para la funcion del agente
	//El metodo es async para permitir el uso de await
	async main(){

		//Contador para la tienda actual
		var actualShop = 0;

		//Imnprime en el log la inicialización del comprador
		this.inicializaLog();
		console.log("Comprador " + this.id + " creado");

		//Bucle principal: intenta contactar una vez con cada tienda
		while(this.productsLeft() && actualShop < this.knownShops.length){

			//Variable de detección de errores
			var error = false;

			//Coge la tienda correspondiente de la lista
			var shop = this.knownShops[actualShop];
			this.shop = shop.getString();

			//Se intenta establecer conexión con la tienda (usando await/async)
			var resultado = await this.manageConnection(shop, true);
			if(resultado){
				//Conexión sin problemas
				this.addToLog("El cliente " + this.id + " se ha conectado a la tienda " + shop.getString() + " con exito.");

				//Comienza el proceso de compra
				resultado = await this.buyTLC(shop);

				//Comprobamos si hay error o no en el mensaje (devuelve un booleano false si ha habido un problema)
				if(resultado){
					//Procesado del mensaje (recoge los productos que le devuelve, imprime los logs correspondientes)
					var productos = this.processTLC(resultado, shop);
					//Comprobamos si tiene algun producto que necesite el cliente
					if(productos.length > 0){
						//Si lo tiene, procedemos a hacer la compra
						resultado = await this.buyTSC(shop, productos);
						//Comprobamos posibles errores
						if(resultado){
							//Procesamos que productos hemos comprado (actualizamos los productos e imprimimos los logs correspondientes)
							this.processTSC(resultado, shop);
						}
						else{
							//Error en la compra, intenta desconexion
							this.addToLog("El cliente " + this.id + " ha sufrido un error realizando una compra en la tienda " + shop.getString());
							error = true;
						}
					}
				}
				else{
					//Error en el envio de la lista de la compra, intenta desconectar
					this.addToLog("El cliente " + this.id + " ha sufrido un error enviando su lista de la compra a la tienda " + shop.getString());
					error = true;
				}
				//Si aun nos quedan productos por comprar y no ha habido un error
				//preguntamos a la tienda sobre las tiendas que nos puede proporcionar y procesamos el resultado
				if(this.productsLeft() && !error){
					this.addToLog("El cliente " + this.id + " tiene productos restantes por comprar.");
					resultado = await this.askForShops(shop);
					if(resultado){
						//Procesado del mensaje (añade tiendas a las tiendas conocidas, imprime los logs correspondientes)
						this.processShops(resultado, shop);
					}
					else{
						//Error en la solicitud de tiendas
						this.addToLog("El cliente " + this.id + " ha sufrido un error solicitando más tiendas de la tienda " + shop.getString());
					}
					//Desconexión al acabar
					resultado = await this.manageConnection(shop, false);
				}
				else if(!error){
					//Si no, no es necesario preguntar por las tiendas conocidas
					this.addToLog("El cliente " + this.id + " ha comprado todos los productos necesarios.");
					resultado = await this.manageConnection(shop, false);
				}
				else{
					//Desconexión por el error
					resultado = await this.manageConnection(shop, false);
				}
			}
			else{
				//Fallo en la conexión
				this.addToLog("El cliente " + this.id + " no ha podido conectarse a la tienda " + shop.getString());
			}

			//Pasamos a la siguiente tienda
			actualShop++;

			//Comprobamos si ya hemos acabado la compra
			if(this.productsLeft() && this.actualShop >= this.knownShops.length){
				
				//No se ha acabado y no quedan tiendas: MODO PÁNICO
				//Crea un mensaje en el log indicando la entrada en modo pánico
				this.addToLog("El cliente " + this.id + " ha entrado en modo pánico");

				//Preguntamos por tiendas en cada tienda
				for(var shop of knownShops){
					//Nos conectamos a la tienda
					var resultado = await this.manageConnection(shop, true);
					if(resultado){
						//Conexion sin problemas
						this.addToLog("El cliente " + this.id + " se ha conectado a la tienda " + shop.getString() + " con exito.");

						//Preguntamos a la tienda sobre las tiendas que nos puede proporcionar y procesamos el resultado
						resultado = await this.askForShops(shop);
						//Comprobamos si hay error o no en el mensaje (devuelve un booleano false si ha habido un problema)
						if(resultado){
							//Procesado del mensaje (añade tiendas a las tiendas conocidas, imprime los logs correspondientes)
							tiendas = this.processShops(resultado, shop);
						}
						else{
							//Error solicitando mas tiendas
							this.addToLog("El cliente " + this.id + " ha sufrido un error solicitando más tiendas de la tienda " + shop.getString());
							resultado = await this.manageConnection(shop, false);
						}
					}
					else{
					//Fallo en la conexión
					this.addToLog("El cliente " + this.id + " no ha podido conectarse a la tienda " + shop.getString());
					}
					resultado = await this.manageConnection(shop, false);
				}
			}
			
		}

		//Fin de la compra
		var date = new Date();
		this.endHour = date.toISOString().substr(11, 8) + ":" + date.getMilliseconds();

		//Indica si la compra ha acabado con exito o no
		if(this.productsLeft()){
			//Compra fallida (no hemos comprado todos los productos)
			this.shop = "No ha sido posible acabar la compra con éxito."
			customerFinished(false, this.id);
			this.addToLog("El cliente " + this.id + " no ha sido capaz de terminar sus compras con exito.");
		}
		else{
			//Compra con exito (hemos podido comprar todos los productos)
			this.shop = "Compras terminadas con éxito."
			customerFinished(true, this.id);
			this.addToLog("El cliente " + this.id + " ha terminado sus compras con exito.");
		}
	}

	//Genera lista de productos aleatorios
	generateProductList(totalProduct, customerProduct){

		//Productos a devolver
		var list = [];
		//Total de productos a comprar
		var total = customerProduct;

		//Va añadiendo productos mientras sea posible
		while(total != 0){
			//Genera un ID aleatorio entre 1 y el numero total de productos a comprar
			var id = (Math.floor((Math.random() * totalProduct) + 1));
			//Genera una cantidad aleatoria de productos que no puede exceder el total restante o 10 (lo mas bajo)
			var numItems = Math.floor((Math.random() * Math.min(total, 10)) + 1);

			//Se comprueba si el producto se ha generado anteriormente
			if(this.isIn(id, list)){
				//De ser así, se incremente la cantidad de producto por comprar
				var item = list.find(function(element) { 
					return element.getId() == id; 
				})
				item.addQuantity(numItems);
			//En otro caso, se añade a la lista
			}else{
				list.push(new Product(id, numItems));
			}
			//Se actualiza el total de productos por comprar
			total = total - numItems;
		}
		return list;
	}
	
	//Genera lista de tiendas conocidas aleatoriamente
	generateShopList(numberOfShops, shopIPList, shopPerIP){

		//Tiendas generadas
		var tiendasGeneradas = [];

		//Genera numberOfShops tiendas
		for (var i = 0; i < numberOfShops; i++){
			var tienda = null;
			var tiendaNueva = false;
			
			//Genera una tienda nueva
			while(!tiendaNueva){
				//IP de la tienda
				var IP = shopIPList[Math.floor(Math.random()*shopIPList.length)];
				//Id de la tienda
				var id = Math.floor(Math.random()*shopPerIP + 1);

				//Crea la tienda 
				tienda = new KnownShop(IP,id);
				tiendaNueva = true;

				for (var tiendaComprobar of tiendasGeneradas){
					if (tienda.getIp() == tiendaComprobar.getIp() && tienda.getId() == tiendaComprobar.getId()) tiendaNueva = false;
				} 
			}
			
			//Añade la tienda a la lista
			tiendasGeneradas.push(tienda);
		}

		//Devuelve las tiendas generadas
		return tiendasGeneradas;
	}
	
	//Comprueba si el producto esta en la lista
	isIn(id, list){
		//Si alguno de los objetos de la lista tiene el mismo ID que el pasado por parametro,
		//devuelve verdadero
		for(var object of list){
			if(id == (object.getId())){
				return true;
			}
		}
		//Devuelve falso en cualquier otro caso
		return false;
	}
	
	//Quita los productos especificados en la lista de los productos por comprar
	//(reduce la cantidad restante a 0)
	reduceProducts(products){
		for(var product1 of products){
			for(var product2 of productList){
				//Si el producto está dentro de la lista de productos a comprar, reduce la cantidad
				if(product1.getId() == product2.getId()){
					var item = list.find(function(element) { 
						return element.getId() == product1.getId(); 
					})
					item.reduceQuantity(product1.getQuantity());
				}
			}
		}
	}

	//Encuentra al producto en la lista y reduce la cantidad especificada
	reduceProductQuantity(id, quantity){
		for(var i = 0; i < this.productList.length; i++){
			if(this.productList[i].getId() == id){
				this.productList[i].reduceQuantity(quantity);
				return;
			}
		}
	}
	
	//Comprueba si le quedan productos por comprar
	productsLeft(){
		for (var product of this.productList) {
			if (product.getQuantity() != 0)
				return true;
		}
		return false;		
	}
	
	//Intenta conectarse (entrar) a una tienda. Método asíncrono
	manageConnection(shop, connect){

		//Inicio del mensaje del log
		if(connect){
			this.addToLog("El cliente " + this.id + " intenta conectarse a la tienda " + shop.getString());
		}
		else{
			this.addToLog("El cliente " + this.id + " se va a desconectar de la tienda " + shop.getString());
		}
		
		//Se construye el XML
		var cabecera = {
			idMensaje: this.messages,
			ipEmisor: this.ip,
			idEmisor: this.id,
			ipReceptor: shop.getIp(),
			idReceptor: shop.getId(),
			tipoMensaje: "TSAT"
		};
		var cuerpo = {
			arrayTiendas: this.knownShops,
			conexion: connect
		};
		var mensaje = composeMessage(cabecera, cuerpo);

		//DEBUG
		this.alerta("Mensaje de conexion: " + mensaje);

		//Puntero al propio cliente (para usar dentro de la promesa)
		var self = this;

		//PROMESA:
		return new Promise(function(resolve, reject){

			//Se prepara la conexión a la tienda
			var xhr = new XMLHttpRequest();

			//Se establece la conexión
			xhr.open("POST", "http://" + shop.getIp() + ":" + self.port + "/" + self.hotelHost, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.timeout = self.messageTimeout;

			//Error de conexión
			xhr.onerror = function(){
				resolve(false);
			};

			//Timeout
			xhr.ontimeout = function(){
				resolve(false);
			}

			//Respuesta
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					//XML recibido (en este caso, al ser un ACK no hace falta comprobar nada)
					self.alerta("Mensaje recibido de conexion: " + xhr.responseText);
					resolve(true);
				}
			};

			//Envio del XML
			xhr.send("mensaje="+mensaje);
			self.mandaMensaje();
		})
	
	}
	
	//Pregunta a la tienda por otras tiendas. Método asíncrono
	askForShops(shop){
		
		//Inicio del mensaje del log
		this.addToLog("El cliente " + this.id + " pide a la tienda " + shop.getString() + " el resto de tiendas que conoce.");

		//Se construye el XML
		var cabecera = {
			idMensaje: this.messages,
			ipEmisor: this.ip,
			idEmisor: this.id,
			ipReceptor: shop.getIp(),
			idReceptor: shop.getId(),
			tipoMensaje: "TDOT"
		};
		var cuerpo = {};
		var mensaje = composeMessage(cabecera, cuerpo);

		this.alerta("Mensaje de solicitud de tiendas: " + mensaje);

		//Puntero al propio cliente (para usar dentro de la promesa)
		var self = this;

		this.logDebug("Mandamos mensaje de solicitud de tiendas")
		//PROMESA:
		return new Promise(function(resolve, reject){

			//Se prepara la conexión
			var xhr = new XMLHttpRequest();

			//Se establece la conexión
			xhr.open("POST", "http://" + shop.getIp() + ":" + self.port + "/" + self.hotelHost, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.timeout = self.messageTimeout;

			//Error de conexión
			xhr.onerror = function(){
				self.alerta("Mensaje de error en respuesta de solicitud de tiendas: " + xhr.responseText);
				resolve(false);
			};

			//Timeout
			xhr.ontimeout = function(){
				resolve(false);
			}

			//Respuesta
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					//XML recibido, lo devolvemos
					self.alerta("Mensaje de respuesta de solicitud de tiendas: " + xhr.responseText);
					resolve(xhr);
				}
			};

			//Envio del XML
			xhr.send("mensaje="+mensaje);
			self.mandaMensaje();
		})
	}

	//Procesa la lista de tiendas
	processShops(xhr, shop){
		//Lee el contenido del mensaje
		var procesado = cargarXMLCuerpo(xhr);
		this.logDebug(JSON.stringify(procesado));
		this.logDebug(procesado.ips.length);

		//Tiendas por añadir
		var tiendasNuevas = [];

		//Saca las tiendas
		for(var i = 0;i < procesado.ips.length; i++){
			this.logDebug("Valor de i: " + i)
			var tienda = new KnownShop(procesado.ips[i], parseInt(procesado.ids[i]));
			this.logDebug("Tienda nueva - ip: " + tienda.getIp() + " - id: " + tienda.getId());

			//Comprueba si la tienda está en las listas conocidas
			var nueva = true;
			for(var shop2 of this.knownShops){

				if(this.equalsShops(tienda,shop2)){
					nueva = false;
					this.logDebug("Coincidencia");
					break;
				}
			}

			//Si la tienda es nueva, se introduce a KnownShops y a la lista de tiendas nuevas
			if(nueva){
				this.logDebug("Tienda nueva");
				this.knownShops.push(tienda);
				tiendasNuevas.push(tienda);
			}
		}

		//Mensaje de log correspondiente
		if(tiendasNuevas.length > 0){
			this.addToLog("Las tiendas nuevas que el cliente " + this.id + " ha conocido de la tienda " + shop.getString() + " son las siguientes:");
			for(var tienda of tiendasNuevas){
				this.addToLog("* " + tienda.getString());
			}
		}
		else{
			this.addToLog("El cliente " + this.id + " no ha conocido ninguna tienda nueva de la tienda " + shop.getString());
		}

	}

	//Comprueba si dos tiendas son equivalentes
	equalsShops(shop1, shop2){
		if (!(shop1.ip === shop2.ip)) return false;
		if (shop1.id != shop2.id) return false;
		return true;
	}
	
	//Pasa lista de la compra a la tienda para saber que productos tiene. Método asíncrono.
	buyTLC(shop){

		//Mensaje de log
		this.addToLog("El cliente " + this.id + " manda su lista de la compra a la tienda " + shop.getString());

		//Construcción del mensaje
		var cabecera = {
			idMensaje: this.messages,
			ipEmisor: this.ip,
			idEmisor: this.id,
			ipReceptor: shop.getIp(),
			idReceptor: shop.getId(),
			tipoMensaje: "TLC"
		};
		var productNameList = [];
		var quantityList = [];

		//En el cuerpo se añaden únicamente los productos que no están ya totalmente comprados
		for(var product of this.productList){
			if(!product.isBought()){
				productNameList.push(product.getId());
				quantityList.push(product.getQuantity());
			}
		}
		var cuerpo = {
			arrayIdsProducto: productNameList, 
			arrayCantidad: quantityList
		};
		var mensaje = composeMessage(cabecera, cuerpo);

		//Puntero al propio cliente (para usar dentro de la promesa)
		var self = this;

		//PROMESA:
		return new Promise(function(resolve, reject){

			//Se prepara la conexión
			var xhr = new XMLHttpRequest();

			//Se establece la conexión
			xhr.open("POST", "http://" + shop.getIp() + ":" + self.port + "/" + self.hotelHost, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.timeout = self.messageTimeout;

			//Error de conexión
			xhr.onerror = function(){
				resolve(false);
			};

			//Timeout
			xhr.ontimeout = function(){
				resolve(false);
			}

			//Respuesta
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					//XML recibido, lo devolvemos
					resolve(xhr);
				}
			};

			//Envio del XML
			xhr.send("mensaje="+mensaje);
			self.mandaMensaje();
		})
	}

	//Procesa mensaje con los productos disponibles por la tienda
	processTLC(xhr, shop){
		//Lee el contenido del mensaje
		var procesado = cargarXMLCuerpo(xhr);

		var productos = [];
		this.precios = [];

		//Va recogiendo los productos devueltos
		for(var i = 0; i < procesado.idsProductos.length; i++){
			productos.push(new Product(procesado.idsProductos[i], procesado.cantidadesProductos[i]));
			this.precios.push(procesado.preciosProductos[i]);
		}

		var i = 0;

		//Mensaje de log correspondiente
		if(productos.length > 0){
			this.addToLog("La tienda " + shop.getString() + " tiene los siguientes productos que necesita el comprador " + this.id + ":");
			for(var producto of productos){
				this.addToLog("* Producto " + producto.getId() + " - " + this.precios[i] + " €");
				i++;
			}
		}
		else{
			this.addToLog("La tienda " + shop.getString() + " no tiene ningun producto que necesite el comprador " + this.id );
		}

		return productos;
	}

	//Pasa lista a la tienda con los productos que va a comprar. Método asíncrono.
	buyTSC(shop, productos){

		//Mensaje de log
		this.addToLog("El cliente " + this.id + " solicita comprar productos a la tienda " + shop.getString());

		//Construccion del mensaje
		var cabecera = {
			idMensaje: this.messages,
			ipEmisor: this.ip,
			idEmisor: this.id,
			ipReceptor: shop.getIp(),
			idReceptor: shop.getId(),
			tipoMensaje: "TSC"
		};
		var productNameList = [];
		var quantityList = [];
		for(var product of productos){
			productNameList.push(product.getId());
			quantityList.push(product.getQuantity());
		}
		var cuerpo = {
			arrayIdsProducto: productNameList, 
			arrayCantidad: quantityList
		};
		//LEER Y ACTUALIZAR PRODUCTOS

		var mensaje = composeMessage(cabecera, cuerpo);
		var self = this;

		//PROMESA:
		return new Promise(function(resolve, reject){

			//Se prepara la conexión
			var xhr = new XMLHttpRequest();

			//Se establece la conexión
			xhr.open("POST", "http://" + shop.getIp() + ":" + self.port + "/" + self.hotelHost, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.timeout = self.messageTimeout;

			//Error de conexión
			xhr.onerror = function(){
				resolve(false);
			};

			//Timeout
			xhr.ontimeout = function(){
				resolve(false);
			}

			//Respuesta
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					//XML recibido, lo devolvemos
					resolve(xhr);
				}
			};

			//Envio del XML
			xhr.send("mensaje="+mensaje);
			self.mandaMensaje();
		})
	}

	//Procesa mensaje con la respuesta de la tienda tras la compra
	processTSC(xhr, shop){
		//Lee el contenido del mensaje
		var procesado = cargarXMLCuerpo(xhr);

		var productos = [];

		//Va recogiendo los productos y precios devueltos
		for(var i = 0; i < procesado.idsProductos.length; i++){
			productos.push(new Product(procesado.idsProductos[i], procesado.cantidadesProductos[i]));
		}

		var j = 0;
		var dinero = 0;

		//Mensaje de log correspondiente y actualización de la cantidad de los productos
		if(productos.length > 0){
			this.addToLog("El comprador " + this.id + " ha comprado los siguientes productos de la tienda " + shop.getString() + ":");
			for(var i = 0; i < productos.length; i++){
				//Encuentra el producto en la lista y reduce su cantidad
				this.reduceProductQuantity(productos[i].getId(),productos[i].getQuantity());
				this.addToLog("* Producto " + productos[i].getId() + " (" + productos[i].getOriginalQuantity() + " uds) - " + this.precios[j] + " €/ud");
				var temp = Number(dinero) + Number(this.precios[j]);
				dinero += temp;
				j++;
			}
			var temp = Number(dinero) + Number(this.money);
			this.money = temp;
			customerSpentMoney(this.money);
		}
		else{
			this.addToLog("El comprador " + this.id + " no ha podido comprar ningun producto de la tienda " + shop.getString());
		}
	}

	//Imprime en el log informacion util al inicio
	inicializaLog(){
		//Imprime su ID
		this.addToLog("Comprador " + this.id + " inicializado.");
		//Imprime las tiendas iniciales conocidas
		this.addToLog("Las tiendas iniciales que conoce el comprador " + this.id + " son: ");
		for(var shop of this.knownShops){
			this.addToLog("* " + shop.getString());
		}
	}

	//Metodo get del log del comprador
	getLog(){
		return this.log;
	}
	
	//Metodo get del ID del comprador
	getID(){
		return this.id;
	}
	
	//Metodo get de la tienda en la que se encuentra el comprador
	getShop(){
		return this.shop;
	}
	
	//Metodo get de la lista de compra del comprador
	getProductList(){
		return this.productList;
	}
	
	//Metodo get de la hora inicial de compra
	getStartHour(){
		return this.startHour;
	}
	
	//Metodo get de la hora final de compra
	getEndHour(){
		return this.endHour;
	}
	
	//Metodo get de la cantidad de mensajes mandados por el comprador
	getMessages(){
		return this.messages;
	}

	//Metodo get del dinero gastado por el comprador
	getMoneySpent(){
		return this.money;
	}

	//Se encarga de actualizar el log
	addToLog(string){
		this.log.push(string);

		//Mete el log en el log general
		pushToLog(string);

		//Actualiza el log y el comprador en pantalla si es el comprador activo en el hotel
		requestUpdate(this.id);
	}

	//Manda alerta si esta en modo debug
	alerta(mensaje){
		if(this.debug){
			alert(mensaje)
		}
	}

	//Incrementa mensajes y avisa al monitor
	mandaMensaje(){
		this.messages++;
		messageSent();
	}

	//Log en consola si est en modo debug
	logDebug(mensaje){
		if(this.debug){
			console.log(mensaje)
		}
	}
}