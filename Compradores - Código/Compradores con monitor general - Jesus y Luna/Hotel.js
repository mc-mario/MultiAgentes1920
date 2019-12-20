//JESUS ANDRES FERNANDEZ Y LUNA JIMÉNEZ FERNÁNDEZ
//Ultima modificacion: 21/12/19
//Version: 6.1

//ID del siguiente comprador a crear y lista de compradores
var customerID = 0;
var customers = [];

//Comprador mostrado en pantalla (-1 == Monitor general)
var selectedCustomer = -1;

//Variables de monitorizacion (usadas para el monitor general)
var totalCustomers = 0;
var finishedCustomers = 0;
var successfulCustomers = 0;
var failedCustomers = 0;
var failedCustomersList = [];
var totalMessages = 0;
var totalMoney = 0.0;
var startHour = "None";
var endHour = "None";

//Crea a los compradores al pulsar el boton
function createCustomers(){	
	
	//Extrae los valores de los campos
	var number = document.getElementById("num").value;
	var totalProduct = document.getElementById("totalProduct").value;
	var customerProduct = document.getElementById("clientProduct").value;
	var shopPerIP = document.getElementById("shops").value;

	//En la primera creación de compradores nos interesa cambiar toda la información del monitor general
	if(totalCustomers == 0){
		totalCustomers = number;
		finishedCustomers = 0;
		successfulCustomers = 0;
		failedCustomers = 0;
		totalMessages = 0;
		totalMoney = 0;
		var date = new Date();
		startHour = date.toISOString().substr(11, 8) + ":" +  date.getMilliseconds();
		endHour = " --- ";
	}
	//En las sucesivas, solo queremos cambiar el total de compradores y la hora de finalizacion
	else{
		var suma = Number(totalCustomers) + Number(number);
		totalCustomers = suma;
		endHour = " --- ";
	}

	//Intenta actualizar el monitor general si está visible
	requestUpdate(-1);
	
	//Crea los compradores y los lanza secuencialmente (aunque se ejecuten concurrentemente posteriormente)
	for (let i = 0; i < number; i++) {
		var customer = new Customer(customerID, totalProduct, customerProduct, shopPerIP, this);
		addCustomerToList(customer);
		customers.push(customer);
		customerID++;
		customer.main();
	}
}

//Anade el comprador a la lista de compradores del html
function addCustomerToList(cust){
	
	var customer = document.createElement("div");
	customer.setAttribute("id", cust.getID());

	//Cuando se hace click en un comprador, se muestra su monitor
	customer.setAttribute("onclick", "displayInfoCustomer(this.id)");

	customer.setAttribute("class", "cliente");
	var id = document.createTextNode("Comprador " + cust.getID());
	customer.appendChild(id);
	var list = document.getElementById("customerList"); 
	list.appendChild(customer); 
	
}

//Muestra la informacion del cliente seleccionado
function displayInfoCustomer(id){

	//Marca el cliente como seleccionado
	this.selectedCustomer = id;

	//Muestra el monitor del comprador y esconde el monitor general
	document.getElementById("cajaGeneral").style.display = "none";
	document.getElementById("cajaComprador").style.display = "block";

	//Actualiza todos los campos en el monitor del comprador
	document.getElementById("log").innerHTML = "";
	for (var customer of customers){
		if(id == customer.getID()){
			document.getElementById("clienteActual").innerHTML = customer.getID();
			document.getElementById("tiendaActual").innerHTML = customer.getShop();
			document.getElementById("horaInicio").innerHTML = customer.getStartHour();
			document.getElementById("horaFinalizacion").innerHTML = customer.getEndHour();
			document.getElementById("dineroComprador").innerHTML = customer.getMoneySpent() + " €";
			document.getElementById("cantidadMensajes").innerHTML = customer.getMessages();
			this.addTable(customer);
			var log = customer.getLog();
			for(var line of log){
				document.getElementById("log").innerHTML += line + "<br>";
			}
		}
	}
}

//Crea la tabla de productos y la muestra en informacion
//Utilizado para el monitor del comprador
function addTable(customer){
	
	var td;
	var tr;
	
	var myTableDiv = document.getElementById("dynamicTable");
	var tbl = document.getElementById('table'); 
	if(tbl) dynamicTable.removeChild(tbl);
	var table = document.createElement('TABLE');
	table.setAttribute("id", "table");
	table.border = '1';

	// Comienza creando la cabeza de la tabla
	var tableHead = document.createElement('THEAD');
	tr = document.createElement('TR');
	tableHead.appendChild(tr);
	
	td = document.createElement('TH');
	td.appendChild(document.createTextNode('Productos a comprar'));
	tr.appendChild(td);

	td = document.createElement('TH');
	td.appendChild(document.createTextNode('Cantidad restante por comprar'));
	tr.appendChild(td);

	td = document.createElement('TH');
	td.appendChild(document.createTextNode('Cantidad original a comprar'));
	tr.appendChild(td);
	
	table.appendChild(tableHead);
	
	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	
	var list = customer.getProductList();

	for (var product of list) {
		// Table row
		tr = document.createElement('TR');
		tableBody.appendChild(tr);
		// Product column
		td = document.createElement('TD');
		td.appendChild(document.createTextNode("Producto " + product.getId()));
		tr.appendChild(td);
		// Quantity column
		td = document.createElement('TD');
		td.appendChild(document.createTextNode(product.getQuantity()));
		tr.appendChild(td);
		// Original quantity column
		td = document.createElement('TD');
		td.appendChild(document.createTextNode(product.getOriginalQuantity()));
		tr.appendChild(td);
	}
	myTableDiv.appendChild(table);

}

//Imprime el monitor general en pantalla
function displayInfoMonitor(){

	//Marca el monitor general como seleccionado
	selectedCustomer = -1;

	//Muestra el monitor general y esconde el monitor de comprador
	document.getElementById("cajaComprador").style.display = "none";
	document.getElementById("cajaGeneral").style.display = "block";

	//Actualiza todos los campos
	document.getElementById("compradoresTotales").innerHTML = totalCustomers;
	document.getElementById("compradoresFinalizados").innerHTML = finishedCustomers + "/" + totalCustomers;
	document.getElementById("compradoresExito").innerHTML = successfulCustomers;
	document.getElementById("compradoresFracaso").innerHTML = failedCustomers;

	//Imprime lista con los fracasos si los hay
	if (failedCustomers > 0){
		document.getElementById("compradoresFracaso").innerHTML += "<br>";
		document.getElementById("compradoresFracaso").innerHTML += "Compradores fallidos: <br>";
		for(var fracaso of failedCustomersList){
			document.getElementById("compradoresFracaso").innerHTML += "* Comprador " + fracaso + "<br>";
		}
	}

	document.getElementById("mensajesTotal").innerHTML = totalMessages;
	document.getElementById("dineroTotal").innerHTML = totalMoney + " €";
	document.getElementById("horaInicioTotal").innerHTML = startHour;
	document.getElementById("horaFinTotal").innerHTML = endHour;

	//Vacia el log (el monitor general no imprime logs)
	document.getElementById("log").innerHTML = "";

}

//Solicita actualizar la info en pantalla si es necesario (el monitor del solicitante está actualmente en pantalla)
//Esta función será llamada por los compradores cada vez que deberían actualizar algo en su monitor
//y por el hotel de compradores cada vez que uno de sus callbacks sea llamado
function requestUpdate(id){
	if(id == -1 && id == this.selectedCustomer) displayInfoMonitor();
	else if(id == this.selectedCustomer) displayInfoCustomer(id);
}

//CALLBACKS
//Se ha mandado un mensaje
function messageSent(){
	totalMessages++;
	requestUpdate(-1);
}

//Un cliente ha acabado sus compras
function customerFinished(state, varCust){
	if (state){ //Acabado con exito: TRUE
		successfulCustomers++;
	}
	else{ //Acabado mal: FALSE
		failedCustomers++;
		failedCustomersList.push(varCust);
	}
	finishedCustomers++;

	//Si ya han acabado todos, calcula la hora de finalización
	if(finishedCustomers == totalCustomers){
		var date = new Date();
		endHour = date.toISOString().substr(11, 8) + ":" +  date.getMilliseconds();
	}
	requestUpdate(-1);
}

//Un comprador ha gastado dinero
function customerSpentMoney(money){
	totalMoney += money;
}