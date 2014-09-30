var FormulaView = Backbone.View.extend({
	tagName: "div",

	template: _.template($("#function-view-template").html()),

	events: {
		"focus .function-edit"          : "focus",
		"blur .function-edit"           : "focus",
		"keyup .function-edit"          : "functionChange",
		"keydown .function-edit"        : "suppressEnter",
		"click .menu-roll"              : "menuRoll",
		"click .toggle-visibility"      : "toggleVisibility",
		"click .toggle-eval"            : "toggleEval",
		"click .remove"                 : "removeFormula",
		"mousewheel .scrollable-number" : "scrollNumber",
	},

	initialize: function(){
		// this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		// this.listenTo(this.model, 'change:functionString', this.switchString);
		this.listenTo(this.model, 'change:focus', this.switchString);

		this.listenTo(this.model, "change:visible", this.render);
		this.listenTo(this.model, "change:eval", this.render);

		this.render();
		
	},

	addColorPicker: function() {
		var _this = this;

		this.$(".function-id").colpick({
			colorScheme:'dark',
			// layout:'rgbhex',
			layout:'hex',
			color: this.model.get("color"),
			onChange: function(hsb, hex, rgb, el) {
				var color = '#'+hex;
				_this.model.set("color", color)
				$(el).css('background-color', color);
			},
			onSubmit: function(hsb, hex, rgb, el) {
				$(el).colpickHide();
			}
		});
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		this.addColorPicker();
		return this.el;
	},

	scrollNumber: function(e){
		var el = $(e.currentTarget);
		var currentNumber = parseFloat(el.text());
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
		this.model.toggleVisibility();
	},

	toggleEval: function(){
		this.model.toggleEval();
	},

	removeFormula: function(){
		// this.model.parent.remove(this.model);
		this.model.destroy();
	},

	menuRoll: function(){
		this.$el.height(200);
	},
	
	switchString: function(){
		if(this.model.get("focus") || this.model.get("eval")){
			this.$(".function-edit").text(this.model.get("functionString"));
		}
		else {
			this.$(".function-edit").html(this.model.get("fancyString"));
		}
	},

	focus: function(e){
		this.model.set("focus", e.type == "focusin");
	},

	functionChange: function(e){
		this.model.set("functionString", this.$(".function-edit").text());
	},

	suppressEnter: function(e){
		if(e.keyCode == 13 && !this.model.get("eval")){
			e.preventDefault();
			this.$(".function-edit").blur();
			return false;
		}
	},

	plot: function(ctx, camera, width){
		if(!this.model.get("visible"))
			return;

		// ctx.fillStyle = "#D7D49A";
		ctx.strokeStyle = this.model.get("color");

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
