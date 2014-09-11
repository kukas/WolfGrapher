var Function = Backbone.Model.extend({
	initialize: function(){
		this.listenTo(this, "change:functionString", this.parseFunction);
		this.parseFunction();
	},

	defaults: function(){
		return {
			functionString: "",
			fancyString: "",
			color: "#4E5E5B",
			visible: true,
			focus: false,
		};
	},

	parseFunction: function(){
		var functionString = this.get("functionString");
		var fancyString = functionString.replace(/-?[0-9]+(\.[0-9]+)?/g, "<span class='scrollable-number'>$&</span>");
		
		// this.set("functionString", functionString);
		this.set("fancyString", fancyString);

		var parsedString = functionString;
		// doplní násobení mezi písmeno a číslo
		parsedString = parsedString.replace(/([0-9]+)([a-z(])/g, "$1*$2");
		// nahradí zkratky mat. funkcí opravdovými
		parsedString = parsedString.replace(/(E|PI|pow|abs|acos|asin|atan|atan2|ceil|cos|exp|floor|log|random|round|sin|sqrt|tan)/g, "Math.$1");
		// // nahradí ^|** -> Math.pow
		// parsedString = parsedString.replace(/([a-z]|[0-9]+(\.[0-9]+)?|\([^\(\)]+\))(\*\*|\^)([a-z]|[0-9]+(\.[0-9]+)?|\([^\(\)]+\))/g, "Math.pow($1, $4)");
		console.log(parsedString);
		this._f = function(x){
			return eval(parsedString);
		};
	},

	_f: null,

	f: function(x){
		if(this._f)
			return this._f(x);
		else
			return 0;
	}
});