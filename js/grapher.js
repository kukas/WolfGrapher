var Grapher = Backbone.Model.extend({
	formulas: new Formulas(),

	camera: new Camera({
		grapher: this
	}),
	mouse: {
		down: false,
		position: new Vector(),
		delta: new Vector(),
		downPosition: new Vector(),
		mouseDown: false,
	},

	input: new Formula({
		functionString: "x",
	}),
	inputView: null,

	parameters: new Parameters(),
	parametersView: null,

	initialize: function(){
		this.input.parent = this.formulas;
		this.input.parameters = this.parameters;
		this.inputView = new InputView({
			model: this.input,
			
			el: $(".grapher .function-add"),
		});

		this.functionsView = new FormulasView({
			model: this.formulas,

			el: $(".grapher .left.menu"),
		});

		this.parametersView = new ParametersView({
			model: this.parameters,

			el: $(".grapher .right.menu .parameters"),
		});
	},

	mouseHandler: function(e){
		// console.log(e);
		var type = e.type,
			x = e.clientX,
			y = e.clientY,
			which = e.which;
		if(type == "mousedown"){
			this.mouse.down = which;
			this.set("mouseDown", true);
			
			this.mouse.downPosition.set(x, y);

			this.camera.startPosition(x, y);
		}
		else if(type == "mouseup"){
			if(this.mouse.down !== false){
				this.camera.updatePosition(x, y);
			}
			
			this.mouse.down = false;
			this.set("mouseDown", false);
		}
		else if(type == "mousemove"){
			this.mouse.delta.sub({x:x, y:y}, this.mouse.position);
			this.mouse.position.set(x, y);

			if(this.mouse.down !== false){
				this.camera.updatePosition(x, y);
			}
		}
		else if(type == "mousewheel"){
			// console.log(e.originalEvent);
			this.camera.zoom(-e.originalEvent.deltaY);
			// $(".statusbar").html(e.originalEvent.deltaY+" "+e.originalEvent.wheelDeltaY);
		}
	}
});