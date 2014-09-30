var InputView = FormulaView.extend({
	render: function(){
		this.addColorPicker();
		this.switchString();
	},
	suppressEnter: function(e){
		// todo: super místo tohodle
		if(e.keyCode == 13){
			e.preventDefault();
			this.$(".function-edit").blur();

			var newFormula = new Formula(this.model.toJSON());
			newFormula.parent = this.model.parent;
			newFormula.parameters = this.model.parameters;

			this.model.parent.add(newFormula);

			this.model.set("functionString", "");
			this.switchString();

			return false;
		}
	}
});
