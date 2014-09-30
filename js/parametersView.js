var ParametersView = Backbone.View.extend({
	events: {
		"keyup .parameters-edit"    : "parametersChange",
		"keydown .parameters-edit"  : "cleanEnter",
	},

	initialize: function() {
		this.parametersChange();
	},

	parametersChange: function() {
		var parameters = this.$(".parameters-edit").html();
		parameters = parameters.split(/\n|;\n|;/);
		
		this.model.parameters = {};

		_.each(parameters, function(param){
			var paramArray = param.split("=", 2);
			if(paramArray.length == 2){
				var key = paramArray[0].toUpperCase();
				var value = parseFloat(paramArray[1]);
				this.model.parameters[key] = value;
			}
		}, this);
		console.log(this.model.parameters);

		this.model.trigger("change");
	},

	cleanEnter: function(e){
		if(e.keyCode == 13){
			e.preventDefault();
			document.execCommand('insertHTML', false, '\n\n');
			return false;
		}
	},
});
