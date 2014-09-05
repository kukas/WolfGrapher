var grapher, grapherView;
$(document).ready(function(){
	grapher = new Grapher();

	grapherView = new GrapherView({
		model: grapher,
		el: $(".grapher"),
	});

	grapher.set("viewport", {
		width: window.innerWidth,
		height: window.innerHeight,
	});

	$(window).resize(function(){
		grapher.set("viewport", {
			width: window.innerWidth,
			height: window.innerHeight,
		});
	});
});