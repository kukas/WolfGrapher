var FormulasView = Backbone.View.extend({
	events: {
		"click .function-id"       : "cycleColor",
		"focus .function-edit"     : "focus",
		"blur .function-edit"      : "focus",
		"keyup .function-edit"     : "functionChange",
		"keydown .function-edit"   : "suppressEnter",
		"click .menu-roll"         : "menuRoll",
		"click .toggle-visibility" : "toggleVisibility",
		"click .remove"            : "remove",
	},

	initialize: function(){
		this.listenTo(this.model, 'add', this.addOne);
	},

	addOne: function(model){
		var view = new FormulaView({
			model: model
		});

		model.view = view;
		
		this.$el.append(view.render());
	}
});
