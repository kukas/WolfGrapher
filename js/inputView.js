var InputView = FormulaView.extend({
	render: function(){
		this.switchString();
	},
	suppressEnter: function(e){
		// todo: super místo tohodle
		if(e.keyCode == 13){
			e.preventDefault();
			this.$(".function-edit").blur();

			this.model.parent.add(this.model.toJSON());

			this.model.set("functionString", "");

			return false;
		}
	}
});
