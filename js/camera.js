var Camera = Backbone.Model.extend({
	defaults: {
		viewport: new Vector(),
		position: new Vector(),
		scale: new Vector(20, 20),

		originMousePosition: new Vector(),
		originPosition: new Vector()
	},

	/**
	 * Z pozice na grafu přepočítá na pozici na canvasu
	 * @param  {number} x souřadnice x na grafu
	 * @return {number}   souřadnice x na canvasu
	 */
	tx: function(x){
		return this.get("scale").x*(x - this.get("position").x) + this.get("viewport").x/2;
	},

	ty: function(y){
		return -(this.get("scale").y*(y - this.get("position").y)) + this.get("viewport").y/2;
	},

	/**
	 * Z absolutní souřadnice x na canvasu přepočítá na pozici x na grafu
	 * @param  {number} x souřadnice x na canvasu
	 * @return {number}   souřadnice x na grafu
	 */
	tox: function(x){
		return (x-this.get("viewport").x/2)/this.get("scale").x + this.get("position").x;
	},

	toy: function(y){
		return -(y-this.get("viewport").y/2)/this.get("scale").y + this.get("position").y;
	},

	/**
	 * @return {object} souřadnice levého horního rohu a pravého dolního rohu zobrazené části grafu
	 */
	bounds: function(){
		return {
			topLeft: new Vector(this.tox(0), this.toy(-this.get("viewport").y)),
			bottomRight: new Vector(this.tox(this.get("viewport").x), this.toy(this.get("viewport").y))
		};
	},

	/**
	 * Zjišťuje, zda-li bod leží na ploše canvasu
	 * @param  {number} x
	 * @param  {number} y
	 * @return {bool}
	 */
	inCanvas: function(x, y){
		if(x < 0 || x > this.get("viewport").x || y < 0 || y > this.get("viewport").y)
			return false;
		return true;
	},

	/**
	 * Zjišťuje, zda-li bod leží na ploše zobrazeného grafu
	 * @param  {number} x
	 * @param  {number} y
	 * @return {bool}
	 */
	inViewport: function(x, y){
		return this.inCanvas(this.tx(x), this.ty(y));
	},

	startPosition: function(_x, _y){
		var vec = new Vector(_x, _y);
		this.set("originMousePosition", vec);
		this.set("originPosition", this.get("position").clone());
	},
	updatePosition: function(_x, _y){
		var x = this.get("originPosition").x + this.tox(this.get("originMousePosition").x) - this.tox(_x);
		var y = this.get("originPosition").y + this.toy(this.get("originMousePosition").y) - this.toy(_y);
		this.get("position").set(x, y);
	},

	zoom: function(delta){
		var currentZoom = this.get("scale");
		this.get("scale").addSelf(new Vector(delta*currentZoom.x/1000, delta*currentZoom.y/1000));
		// this.get("scale").multiplyScalar(delta/1000);
	}
});