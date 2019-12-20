//JESUS ANDRES FERNANDEZ Y LUNA JIMÉNEZ FERNÁNDEZ
//Ultima modificacion: 26/11/19
//Version: 2.0

class Product {
	
	//Constructor de la clase producto
	constructor(id, num) {
        this.id = id;
		this.actualQuantity = num;
		this.originalQuantity = num;
    }
	
	//Metodo para saber si el objeto ya está comprado
	isBought(){
		return (this.actualQuantity == 0);
	}

	//Reduce el producto en la cantidad especificada
	reduceQuantity(num){
		this.actualQuantity = this.actualQuantity-num;
	}
	
	//Aumenta el producto en la cantidad especificada
	addQuantity(num){
		this.actualQuantity = this.actualQuantity+num;
	}

	//GETTERS
	getId(){
		return this.id;
	}

	getQuantity(){
		return this.actualQuantity;
	}

	getOriginalQuantity(){
		return this.originalQuantity;
	}
}