var grapher, grapherView;
$(document).ready(function(){
	grapher = new Grapher();

	// grapher.functions.add({
	// 	functionString: "x*x"
	// });
	// grapher.functions.add({
	// 	functionString: "-5*x"
	// });
	grapher.functions.add({
		functionString: "x*x"
	});

	grapherView = new GrapherView({
		model: grapher,
		el: $(".grapher"),
	});

	grapher.camera.get("viewport").set(window.innerWidth, window.innerHeight);
	$(window).resize(function(){
		grapher.camera.get("viewport").set(window.innerWidth, window.innerHeight);
	});

	grapherView.loop();
});