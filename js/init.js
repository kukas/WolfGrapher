var grapher, grapherView;
$(document).ready(function(){
	grapher = new Grapher();
	
	grapherView = new GrapherView({
		model: grapher,
		el: $(".grapher"),
	});
});