define(function(require) {

	var Controller = require('lavaca/mvc/Controller');
	var TodosView = require('app/ui/views/TodosView');
	var models = require('app/cache/models');

	/**
	 * @class app.net.TodosController
	 * @super Lavaca.mvc.Controller
	 * Todos controller
	 */
	var TodosController = Controller.extend({
		home: function(params) {
			// Grab the collection from the global models cache
			var collection = models.get('todos');

			// Set the `filter` parameter on the collection based
			// on the values defined with the routes in app.js
			collection.set('filter', params.filter);

			// Create an instance of TodosView with `collection` as its model
			// and then set a history state which will update the URL
			return this
				.view(null, TodosView, collection)
				.then(this.history({}, document.title, params.url));
		}
	});

	return TodosController;

});