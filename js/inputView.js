var InputView = FormulaView.extend({
	render: function(){
		this.switchString();
	},
	suppressEnter: function(e){
		// todo: super místo tohodle
		if(e.keyCode == 13){
			e.preventDefault();
			this.$(".function-edit").blur();

			var newFormula = this.model.toJSON();
			newFormula.parameters = this.parameters;

			this.model.parent.add(newFormula);

			this.model.set("functionString", "");

			return false;
		}
	}
});
