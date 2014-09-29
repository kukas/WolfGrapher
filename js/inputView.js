var InputView = FormulaView.extend({
	render: function(){
		this.switchString();
	},
	suppressEnter: function(e){
		// todo: super místo tohodle
		if(e.keyCode == 13){
			e.preventDefault();
			this.$(".function-edit").blur();

			var newFormula = new Formula(this.model.toJSON());
			newFormula.parameters = this.model.parameters;

			this.model.parent.add(newFormula);

			this.model.set("functionString", "");

			return false;
		}
	}
});
