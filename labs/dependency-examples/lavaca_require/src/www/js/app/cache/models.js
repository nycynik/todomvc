// Create a gloabl models cache
define(function(require) {
	var Cache = require('lavaca/util/Cache');
	var models = new Cache();
	return models;
});