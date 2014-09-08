var Functions = Backbone.Collection.extend({
	model: Function
});

var Grapher = Backbone.Model.extend({
	functions: new Functions(),

	camera: new Camera(),
});