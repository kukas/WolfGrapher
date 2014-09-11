var FunctionView = Backbone.View.extend({
	tagName: "div",

	template: _.template($("#function-view-template").html()),

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
		// this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'change:focus', this.switchString);

		this.render();
	},

	render: function(){
		// console.log(this.template(this.model.toJSON()));
		// this.$el.html(this.template(this.model.toJSON()));

		return this.el;
	},

	toggleVisibility: function(){
		this.model.toggleVisibility();
	},

	remove: function(){
		this.model.remove();
	},

	menuRoll: function(){
		this.$el.height(200);
	},

	cycleColor: function(){
		this.model.cycleColor();
	},

	switchString: function(){
		if(this.model.get("focus")){
			this.$(".function-edit").html(this.model.get("functionString"));
		}
		else {
			this.$(".function-edit").html(this.model.get("fancyString"));
		}
	},

	focus: function(e){
		this.model.set("focus", e.type == "focusin");
	},

	functionChange: function(e){
		this.model.set("functionString", this.$(".function-edit").html());
	},

	suppressEnter: function(e){
		if(e.keyCode == 13){
			e.preventDefault();
			this.$(".function-edit").blur();
			return false;
		}
	},

	plot: function(ctx, camera, width){
		var xPixel = 1/camera.get("scale").x;
		var lastY = 0;
		var precision = 2;
		// for(var x=bounds.topLeft.x; x<bounds.bottomRight.x; x+=xPixel){
		ctx.beginPath();
		for(var x=0; x<width; x += precision){
			var tox = camera.tox(x);
			var y = this.model.f(tox);

			var tx = camera.tx(tox);
			var ty = camera.ty(y);

			// if(camera.inCanvas(tx, ty)){
				ctx.lineTo(tx, ty, 1, ty-lastY);
				// ctx.fillRect(tx, ty, 1, ty-lastY);
				// ctx.fillText(ty+" "+lastY, tx, ty);
			// }
			// else {
			// 	ctx.stroke();
			// 	ctx.closePath();
			// }
			lastY = ty;
		}
		ctx.stroke();
		ctx.closePath();
	}
});
