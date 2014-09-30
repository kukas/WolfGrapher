var Formula = Backbone.Model.extend({
	initialize: function(){
		var _this = this;
		this.dictionary = {
			"number": function(self){
				return self.value;
			},
			"x": function(){
				return "x";
			},
			"time": function(){
				return "Date.now()";
			},
			"random": function(){
				return "Math.random()";
			},
			"parameter": function(self){
				return "params."+self.value;
			},
			"negation": function(self, args){
				return "-"+_this.translate(args[0]);
			},
			"addition": function(self, args){
				return _this.translate(args[0])+"+"+_this.translate(args[1]);
			},
			"subtraction": function(self, args){
				return _this.translate(args[0])+"-"+_this.translate(args[1]);
			},
			"division": function(self, args){
				return _this.translate(args[0])+"/"+_this.translate(args[1]);
			},
			"multiplication": function(self, args){
				return _this.translate(args[0])+"*"+_this.translate(args[1]);
			},
			"power": function(self, args){
				return "Math.pow("+_this.translate(args[0])+","+_this.translate(args[1])+")";
			},
			"sin": function(self, args){
				return "Math.sin("+_this.translate(args[0])+")";
			},
			"asin": function(self, args){
				return "Math.asin("+_this.translate(args[0])+")";
			},
			"cos": function(self, args){
				return "Math.cos("+_this.translate(args[0])+")";
			},
			"acos": function(self, args){
				return "Math.acos("+_this.translate(args[0])+")";
			},
			"tan": function(self, args){
				return "Math.tan("+_this.translate(args[0])+")";
			},
			"atan": function(self, args){
				return "Math.atan("+_this.translate(args[0])+")";
			},
			"log": function(self, args){
				return "Math.log("+_this.translate(args[0])+")";
			},

			"abs": function(self, args){
				return "Math.abs("+_this.translate(args[0])+")";
			},
			"ceil": function(self, args){
				return "Math.ceil("+_this.translate(args[0])+")";
			},
			"floor": function(self, args){
				return "Math.floor("+_this.translate(args[0])+")";
			},
			"round": function(self, args){
				return "Math.round("+_this.translate(args[0])+")";
			},
		};

		this.listenTo(this, "change:functionString", this.parseFormula);
		this.parseFormula();
	},

	defaults: function(){
		return {
			// id: 0,
			functionString: "",
			fancyString: "",
			color: "#D7D49A",
			visible: true,
			focus: false,
			eval: false,
		};
	},

	translate: function (o) {
		return this.dictionary[o.type](o, o.arguments);
	},

	parseFormula: function(){
		var functionString = this.get("functionString");

		if(this.get("eval")){
			try {
				this._f = new Function("x", "params", functionString);
			}
			catch (e){
				console.log(e.message);

				this._f = function(){
					return NaN;
				};
			}
		}
		else {
			var fancyString = functionString.replace(/-?[0-9]+(\.[0-9]+)?/g, "<span class='scrollable-number'>$&</span>");
			
			this.set("fancyString", fancyString);
			var parsedString = functionString.toUpperCase();
			// doplní násobení mezi písmeno a číslo
			parsedString = parsedString.replace(/([0-9]+)([A-Z(])/g, "$1*$2");

			try {
				var functionTree = parser.parse(parsedString);
				this._f = this.treeToFunction(functionTree);
			}
			catch (e){
				console.log(e.message);

				this._f = function(){
					return NaN;
				};
			}
		}
	},

	// http://jsperf.com/create-function-vs-parse-tree
	treeToFunction: function(tree){
		var f = new Function("x", "params", "return "+this.translate(tree));
		return f;
	},

	_f: null,

	f: function(x){
		if(this._f)
			return this._f(x, this.parameters.getParameters());
		else
			return 0;
	},

	toggleVisibility: function() {
		var visible = this.get("visible");
		this.set("visible", !visible);
	},

	toggleEval: function() {
		var isEval = this.get("eval");
		this.set("eval", !isEval);
	},
});