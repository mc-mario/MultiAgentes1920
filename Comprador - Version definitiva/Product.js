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

	//Metodo get del id del producto
	getId(){
		return this.id;
	}
	
	//Metodo get de la cantidad del producto por comprar
	getQuantity(){
		return this.actualQuantity;
	}
	
	//Reduce el producto en la cantidad especificada
	reduceQuantity(num){
		this.actualQuantity = this.actualQuantity-num;
	}
	
	//Aumenta el producto en la cantidad especificada
	addQuantity(num){
		this.actualQuantity = this.actualQuantity+num;
	}

	//Metodo get de la cantidad del producto original
	getOriginalQuantity(){
		return this.originalQuantity;
	}
}