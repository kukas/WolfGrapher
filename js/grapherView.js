var GrapherView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model.camera.get("viewport"), "change", this.viewportResize);
	},

	viewportResize: function(){
		this.$(".viewport").width(this.model.camera.get("viewport").x);
		this.$(".viewport").height(this.model.camera.get("viewport").y);
	}
});