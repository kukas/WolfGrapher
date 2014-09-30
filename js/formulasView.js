var FormulasView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, 'add', this.addOne);
		this.listenTo(this.model, 'change:focus', this.focus);
	},

	addOne: function(model){
		var view = new FormulaView({
			model: model
		});

		model.view = view;
		
		this.$el.append(view.render());
	},

	focus: function(e){
		var focus = e.get("focus");
		this.$el.toggleClass("focused", focus);
	},
});
