var GrapherView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, "change:viewport", this.viewportResize);
	},

	viewportResize: function(){
		console.log("ahoj");
		
		this.$(".viewport").width(this.model.get("viewport").width);
		this.$(".viewport").height(this.model.get("viewport").height);
	}
});