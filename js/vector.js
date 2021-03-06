// https://github.com/jonobr1/two.js/blob/master/src/vector.js
var Vector = function(x, y) {

	this.x = x || 0;
	this.y = y || 0;

};

_.extend(Vector, {

	zero: new Vector()

});

_.extend(Vector.prototype, Backbone.Events, {

	set: function(x, y) {
		this.x = x;
		this.y = y;
		return this;
	},

	copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},

	clear: function() {
		this.x = 0;
		this.y = 0;
		return this;
	},

	clone: function() {
		return new Vector(this.x, this.y);
	},

	add: function(v1, v2) {
		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		return this;
	},

	addSelf: function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

	sub: function(v1, v2) {
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		return this;
	},

	subSelf: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},

	multiplySelf: function(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	},

	multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	},

	divideScalar: function(s) {
		if (s) {
			this.x /= s;
			this.y /= s;
		} else {
			this.set(0, 0);
		}
		return this;
	},

	negate: function() {
		return this.multiplyScalar(-1);
	},

	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},

	lengthSquared: function() {
		return this.x * this.x + this.y * this.y;
	},

	length: function() {
		return Math.sqrt(this.lengthSquared());
	},

	normalize: function() {
		return this.divideScalar(this.length());
	},

	distanceTo: function(v) {
		return Math.sqrt(this.distanceToSquared(v));
	},

	distanceToSquared: function(v) {
		var dx = this.x - v.x,
				dy = this.y - v.y;
		return dx * dx + dy * dy;
	},

	setLength: function(l) {
		return this.normalize().multiplyScalar(l);
	},

	equals: function(v) {
		return (this.distanceTo(v) < 0.0001 /* almost same position */);
	},

	lerp: function(v, t) {
		var x = (v.x - this.x) * t + this.x;
		var y = (v.y - this.y) * t + this.y;
		return this.set(x, y);
	},

	isZero: function() {
		return (this.length() < 0.0001 /* almost zero */ );
	},

	toString: function() {
		return this.x + ',' + this.y;
	},

	toObject: function() {
		return { x: this.x, y: this.y };
	}

});

var BoundProto = {

	set: function(x, y) {
		this._x = x;
		this._y = y;
		return this.trigger("change");
	},

	copy: function(v) {
		this._x = v.x;
		this._y = v.y;
		return this.trigger("change");
	},

	clear: function() {
		this._x = 0;
		this._y = 0;
		return this.trigger("change");
	},

	clone: function() {
		return new Vector(this._x, this._y);
	},

	add: function(v1, v2) {
		this._x = v1.x + v2.x;
		this._y = v1.y + v2.y;
		return this.trigger("change");
	},

	addSelf: function(v) {
		this._x += v.x;
		this._y += v.y;
		return this.trigger("change");
	},

	sub: function(v1, v2) {
		this._x = v1.x - v2.x;
		this._y = v1.y - v2.y;
		return this.trigger("change");
	},

	subSelf: function(v) {
		this._x -= v.x;
		this._y -= v.y;
		return this.trigger("change");
	},

	multiplySelf: function(v) {
		this._x *= v.x;
		this._y *= v.y;
		return this.trigger("change");
	},

	multiplyScalar: function(s) {
		this._x *= s;
		this._y *= s;
		return this.trigger("change");
	},

	divideScalar: function(s) {
		if (s) {
			this._x /= s;
			this._y /= s;
			return this.trigger("change");
		}
		return this.clear();
	},

	negate: function() {
		return this.multiplyScalar(-1);
	},

	dot: function(v) {
		return this._x * v.x + this._y * v.y;
	},

	lengthSquared: function() {
		return this._x * this._x + this._y * this._y;
	},

	length: function() {
		return Math.sqrt(this.lengthSquared());
	},

	normalize: function() {
		return this.divideScalar(this.length());
	},

	distanceTo: function(v) {
		return Math.sqrt(this.distanceToSquared(v));
	},

	distanceToSquared: function(v) {
		var dx = this._x - v.x,
			dy = this._y - v.y;
		return dx * dx + dy * dy;
	},

	setLength: function(l) {
		return this.normalize().multiplyScalar(l);
	},

	equals: function(v) {
		return (this.distanceTo(v) < 0.0001 /* almost same position */);
	},

	lerp: function(v, t) {
		var x = (v.x - this._x) * t + this._x;
		var y = (v.y - this._y) * t + this._y;
		return this.set(x, y);
	},

	isZero: function() {
		return (this.length() < 0.0001 /* almost zero */ );
	},

	toString: function() {
		return this._x + ',' + this._y;
	},

	toObject: function() {
		return { x: this._x, y: this._y };
	}

};

var xgs = {
	get: function() {
		return this._x;
	},
	set: function(v) {
		this._x = v;
		this.trigger("change", 'x');
	}
};

var ygs = {
	get: function() {
		return this._y;
	},
	set: function(v) {
		this._y = v;
		this.trigger("change", 'y');
	}
};

/**
 * Override Backbone bind / on in order to add properly broadcasting.
 * This allows Vector to not broadcast events unless event listeners
 * are explicity bound to it.
 */

Vector.prototype.bind = Vector.prototype.on = function() {

	if (!this._bound) {
		this._x = this.x;
		this._y = this.y;
		Object.defineProperty(this, 'x', xgs);
		Object.defineProperty(this, 'y', ygs);
		_.extend(this, BoundProto);
		this._bound = true; // Reserved for event initialization check
	}

	Backbone.Events.bind.apply(this, arguments);

	return this;

};
