var customerID = 0;
var customers = [];
var selectedCustomer = -1;

//Crea a los compradores al pulsar el boton
function createCustomers(){	
	
	var number = document.getElementById("num").value;
	var totalProduct = document.getElementById("totalProduct").value;
	var customerProduct = document.getElementById("clientProduct").value;
	var shopPerIP = document.getElementById("shops").value;
	for (let i = 0; i < number; i++) {
		var customer = new Customer(customerID, totalProduct, customerProduct, shopPerIP, this);
		addCustomerToList(customer);
		customers.push(customer);
		customerID++;
	}
	for (var cust of customers) {
		cust.main();
	}
}

//Anade al comprador a la lista de compradores del html
function addCustomerToList(cust){
	
	var customer = document.createElement("div");
	customer.setAttribute("id", cust.getID());
	customer.setAttribute("onclick", "displayInfo(this.id)");
	customer.setAttribute("class", "cliente");
	var id = document.createTextNode("Comprador " + cust.getID());
	customer.appendChild(id);
	var list = document.getElementById("customerList"); 
	list.appendChild(customer); 
	
}

//Muestra la informacion del cliente seleccionado
function displayInfo(id){

	//Marca el cliente como seleccionado
	this.selectedCustomer = id;

	document.getElementById("log").innerHTML = "";
	for (var customer of customers){
		if(id == customer.getID()){
			document.getElementById("clienteActual").innerHTML = customer.getID();
			document.getElementById("tiendaActual").innerHTML = customer.getShop();
			document.getElementById("horaInicio").innerHTML = customer.getStartHour();
			document.getElementById("horaFinalizacion").innerHTML = customer.getEndHour();
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

//Solicita actualizar la info en pantalla si es necesario
function requestUpdate(id){
	if(id == this.selectedCustomer) displayInfo(id);
}