define(function(require) {

	var Controller = require('lavaca/mvc/Controller'),
      TodosView = require('app/ui/views/TodosView'),
      toDosCollection = require('app/models/TodosCollection');

	/**
	 * @class app.net.TodosController
	 * @super Lavaca.mvc.Controller
	 * Todos controller
	 */
	var TodosController = Controller.extend({
		home: function(params) {

			// Set the `filter` parameter on the collection based
			// on the values defined with the routes in app.js
			toDosCollection.set('filter', params.filter);

			// Create an instance of TodosView with `collection` as its model
			// and then set a history state which will update the URL
			return this
				.view(null, TodosView, toDosCollection)
				.then(this.history({}, document.title, params.url));
		}
	});

	return TodosController;

});