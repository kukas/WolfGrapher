var Camera = Backbone.Model.extend({
	defaults: {
		viewport: new Vector(),
		position: new Vector(),
		scale: new Vector()
	},

	setViewport: function(x, y){
		this.get("viewport").set(x, y);

		this.trigger("change:viewport");
	},

	setPosition: function(x, y){
		this.get("position").set(x, y);

		this.trigger("change:position");
	},

	setScale: function(x, y){
		this.get("scale").set(x, y);

		this.trigger("change:scale");
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
			topLeft: new Vec2(this.tox(0), this.toy(-this.viewport.y)),
			bottomRight: new Vec2(this.tox(this.viewport.x), this.toy(this.viewport.y))
		};
	},

	/**
	 * Zjišťuje, zda-li bod leží na ploše canvasu
	 * @param  {number} x
	 * @param  {number} y
	 * @return {bool}
	 */
	inCanvas: function(x, y){
		if(x < 0 || x > this.viewport.x || y < 0 || y > this.viewport.y)
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
});