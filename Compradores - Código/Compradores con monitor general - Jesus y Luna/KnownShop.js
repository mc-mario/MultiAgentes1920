//JESUS ANDRES FERNANDEZ Y LUNA JIMÉNEZ FERNÁNDEZ
//Ultima modificacion: 23/11/19
//Version: 1.0

class KnownShop {
	
	//Constructor de la clase tienda conocida
	constructor(ip, id) {
        this.ip = ip;
		this.id = id;
    }
	
	//GETTERS
	getIp(){
		return this.ip;
	}

	getId(){
		return this.id;
	}

	getString(){
		return this.ip + "-" + this.id;
	}
	
}