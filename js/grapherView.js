var GrapherView = Backbone.View.extend({
	events: {
		"mousedown .viewport": "mouseHandler",
		"mouseup .viewport": "mouseHandler",
		"mousemove .viewport": "mouseHandler",
		// "click .viewport": "mouseHandler",
		"mousewheel .viewport": "mouseHandler",
		"contextmenu .viewport": "prevent",
	},

	initialize: function(){
		this.listenTo(this.model.camera.get("viewport"), "change", this.viewportResize);
		this.listenTo(this.model, "change:mouseDown", this.toggleCursor);

		this.canvas = this.$(".viewport")[0];
		this.ctx = this.canvas.getContext("2d");
	},

	prevent: function(e) {
		e.preventDefault();
	},

	mouseHandler: function(e){
		e.preventDefault();
		this.model.mouseHandler(e);
	},

	toggleCursor: function(){
		if(this.model.get("mouseDown")){
			this.canvas.style.cursor = "move";
		}
		else {
			this.canvas.style.cursor = "default";
		}
	},

	viewportResize: function(){
		this.canvas.width = this.model.camera.get("viewport").x;
		this.canvas.height = this.model.camera.get("viewport").y;
	},

	loop: function(){
		var _this = this;
		requestAnimationFrame(function(){
			_this.loop();
		});

		this.plot();
	},

	plot: function(){
		var ctx = this.ctx;

		var camera = this.model.camera;
		var width = camera.get("viewport").x;
		var height = camera.get("viewport").y;

		ctx.clearRect(0, 0, width, height);

		var bounds = camera.bounds();

		ctx.fillStyle = "#4E5E5B";
		// x osa
		if(camera.inViewport(0, camera.get("position").y)){
			ctx.fillRect(camera.tx(0), 0, 1, height);
			// TODO: automaticky zjistit nejlepší měřítko
			for(var y=Math.round(bounds.bottomRight.y); y<bounds.topLeft.y; y++){
				var x = 0;
				var tx = camera.tx(x);
				var ty = camera.ty(y);

				ctx.fillRect(tx-2, ty, 5, 1);
			}
		}
		// y osa
		if(camera.inViewport(camera.get("position").x, 0)){
			ctx.fillRect(0, camera.ty(0), width, 1);
			for(var x = Math.round(bounds.topLeft.x); x < bounds.bottomRight.x; x++){
				var y = 0;

				var tx = camera.tx(x);
				var ty = camera.ty(y);

				ctx.fillRect(tx, ty-2, 1, 5);
			}
		}

		ctx.fillStyle = "#D7D49A";
		ctx.strokeStyle = "#D7D49A";
		var precision = 2;
		// funkce
		this.model.functions.each(function(func){
			var xPixel = 1/camera.get("scale").x;
			var lastY = 0;
			// for(var x=bounds.topLeft.x; x<bounds.bottomRight.x; x+=xPixel){
			ctx.beginPath();
			for(var x=0; x<width; x += precision){
				var tox = camera.tox(x);
				var y = func.f(tox);

				var tx = camera.tx(tox);
				var ty = camera.ty(y);

				if(camera.inCanvas(tx, ty)){
					ctx.lineTo(tx, ty, 1, ty-lastY);
					// ctx.fillRect(tx, ty, 1, ty-lastY);
					// ctx.fillText(ty+" "+lastY, tx, ty);
				}
				// else {
				// 	ctx.stroke();
				// 	ctx.closePath();
				// }
				lastY = ty;
			}
			ctx.stroke();
			ctx.closePath();
		}, this);

		// crosshair
		ctx.fillStyle = "#7D9F85";
		var size = 11;
		ctx.fillRect(Math.floor(width/2)-Math.floor(size/2), Math.floor(height/2), size, 1);
		ctx.fillRect(Math.floor(width/2), Math.floor(height/2)-Math.floor(size/2), 1, size);
	}
});