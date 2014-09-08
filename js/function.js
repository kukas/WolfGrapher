var Function = Backbone.Model.extend({
	initialize: function(){
		this.listenTo(this, "change:functionString", this.parseFunction);
		this.parseFunction();
	},

	defaults: function(){
		return {
			functionString: ""
		};
	},

	parseFunction: function(){
		var functionString = this.get("functionString");
		this._f = function(x){
			return eval(functionString);
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