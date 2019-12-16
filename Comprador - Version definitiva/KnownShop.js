class KnownShop {
	
	//Constructor de la clase tienda conocida
	constructor(ip, id) {
        this.ip = ip;
		this.id = id;
    }
	
	//Metodo get de la IP de la tienda
	getIp(){
		return this.ip;
	}
	
	//Metodo get del ID de la tienda
	getId(){
		return this.id;
	}

	//Devuelve una version string de la tienda
	getString(){
		return this.ip + "-" + this.id;
	}
	
}