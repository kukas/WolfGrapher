var GrapherView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model.camera.get("viewport"), "change", this.viewportResize);

		this.canvas = this.$(".viewport")[0];
		this.ctx = this.canvas.getContext("2d");
	},

	viewportResize: function(){
		this.canvas.width = this.model.camera.get("viewport").x;
		this.canvas.height = this.model.camera.get("viewport").y;
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
			for(var x = Math.round(bounds.topLeft.x); x < bounds.bottomRight.x; x++){
				var y = 0;

				var tx = camera.tx(x);
				var ty = camera.ty(y);

				ctx.fillRect(tx, ty-2, 1, 5);
			}
		}
		// y osa
		if(camera.inViewport(camera.get("position").x, 0)){
			ctx.fillRect(0, camera.ty(0), width, 1);
			for(var y=Math.round(bounds.bottomRight.y); y<bounds.topLeft.y; y++){
				var x = 0;
				var tx = camera.tx(x);
				var ty = camera.ty(y);

				ctx.fillRect(tx-2, ty, 5, 1);
			}
		}

		// funkce
		this.model.functions.each(function(func){
			var xPixel = 1/camera.get("scale").x/2;
			for(var x=bounds.topLeft.x; x<bounds.bottomRight.x; x+=xPixel){
				var y = func.f(x);

				var tx = camera.tx(x);
				var ty = camera.ty(y);

				if(camera.inCanvas(tx, ty)){
					ctx.fillRect(tx, ty, 1, 1);
				}
			}
		}, this);
	}
});