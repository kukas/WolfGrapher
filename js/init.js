var grapher, grapherView;
$(document).ready(function(){
	grapher = new Grapher();

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