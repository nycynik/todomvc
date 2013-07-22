define(function(require) {

	var CollectionView = require('app/ui/views/CollectionView'),
			TodoItemView = require('app/ui/views/TodoItemView'),
			$ = require('$');

	/**
	 * Todos view type
	 * @class app.ui.views.TodosCollectionView
	 * @super app/ui/views/CollectionView
	 */
	var TodosCollectionView = CollectionView.extend({
		/**
		 * A class name added to the view container
		 * @property className
		 * @type String
		 */
		className: 'todos-collection-view',
		/**
		 * A function that should return a jQuery element
		 * that will be used as the `el` for a particular
		 * item in the collection. The function is passed
		 * two parameters, the model and the index.
		 * @property itemEl
		 * @type jQuery
		 */
		itemEl: function() {
			return $('<li/>');
		},
		/**
		 * The view type used for each item view
		 * @property itemEl
		 * @type lavaca.mvc.View
		 */
		TView: TodoItemView,
		/**
		 * The filter to run against the collection
		 * @method modelFilter
		 * @param {Number} [i] the index
		 * @param {Object} [model] the model
		 */
		modelFilter: function(i, model) {
			var filter = this.model.get('filter');
			var shouldBeComplete = filter === 'completed';

			if (filter === 'all' || model.get('completed') === shouldBeComplete) {
				return true;
			}
		}

	});

	return TodosCollectionView;

});
