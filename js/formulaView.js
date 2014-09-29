var FormulaView = Backbone.View.extend({
	tagName: "div",

	template: _.template($("#function-view-template").html()),

	events: {
		"click .function-id"            : "cycleColor",
		"focus .function-edit"          : "focus",
		"blur .function-edit"           : "focus",
		"keyup .function-edit"          : "functionChange",
		"keydown .function-edit"        : "suppressEnter",
		"click .menu-roll"              : "menuRoll",
		"click .toggle-visibility"      : "toggleVisibility",
		"click .remove"                 : "removeFormula",
		"mousewheel .scrollable-number" : "scrollNumber",
	},

	initialize: function(){
		// this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'change:functionString', this.switchString);
		this.listenTo(this.model, 'change:focus', this.switchString);

		this.render();
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));

		return this.el;
	},

	scrollNumber: function(e){
		var el = $(e.currentTarget);
		var currentNumber = parseFloat(el.html());
		var deltaY = e.originalEvent.deltaY;
		var sign = -deltaY/Math.abs(deltaY);
		var add = 0;
		if(currentNumber == 0){
			add = 1;
		}
		else {
			var exp = Math.log(Math.abs(currentNumber))/Math.log(10);
			add = Math.pow(10, Math.ceil(exp)-2);
		}

		currentNumber += sign * add;

		el.html(Math.round(currentNumber*1000)/1000);
	},

	toggleVisibility: function(){
		console.log("ahooj")
		this.model.toggleVisibility();
		this.render();
	},

	removeFormula: function(){
		// this.model.parent.remove(this.model);
		this.model.destroy();
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
		if(!this.model.get("visible"))
			return;

		var lastY = false;
		var precision = 1;
		var drawing = false;

		for(var x=0; x<width; x += precision){
			var tox = camera.tox(x);
			var y = this.model.f(tox);

			var tx = x;
			var ty = camera.ty(y);

			if(camera.inCanvas(tx, ty)){
				if(drawing){
					ctx.lineTo(tx, ty);
				}
				else {
					drawing = true;
					ctx.beginPath();

					if(lastY !== false){
						ctx.moveTo(tx-1, lastY);
						ctx.lineTo(tx, ty);
					}
					else {
						ctx.moveTo(tx, ty);
					}
				}
			}
			else {
				if(drawing){
					drawing = false;

					ctx.lineTo(tx, ty);
					ctx.stroke();
				}
			}
			lastY = ty;
		}

		if(drawing){
			ctx.stroke();
			ctx.closePath();
		}
	}
});
