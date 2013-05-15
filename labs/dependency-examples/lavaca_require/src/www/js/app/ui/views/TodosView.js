define(function(require) {

	// constants
	var ENTER_KEY = 13;

	var PageView = require('lavaca/mvc/PageView');
	var $ = require('$');

	/**
	 * @class app.ui.views.TodosView
	 * @super Lavaca.mvc.PageView
	 * Todos view type
	 */
	var TodosView = PageView.extend(function TodosView() {
		var modelChangeHandler;

		// Call the super class' constructor
		PageView.apply(this, arguments);

		// Map DOM and model events to event handler
		// functions declared below
		modelChangeHandler = modelChange.bind(this);
		this.mapEvent({
			'#new-todo': {
				keypress: addTodo.bind(this)
			},
			'button.destroy': {
				click: remove.bind(this)
			},
			'input.toggle': {
				change: toggleComplete.bind(this)
			},
			'li': {
				dblclick: startEditing.bind(this)
			},
			'input.edit': {
				keypress: editTodo.bind(this)
			},
			'input#toggle-all': {
				change: toggleAll.bind(this)
			},
			'button#clear-completed': {
				click: removeCompleted.bind(this)
			},
			model: {
				'change': modelChangeHandler,
				'addItem': modelChangeHandler,
				'moveItem': modelChangeHandler,
				'removeItem': modelChangeHandler,
				'changeItem': modelChangeHandler
			}
		});
	},{
		/**
		 * @field {String} template
		 * @default 'example'
		 * The name of the template used by the view
		 */
		template: 'todos',
		/**
		 * @field {String} className
		 * @default 'example'
		 * A class name added to the view container
		 */
		className: 'todos'

	});

	/* ---- Event Handlers ---- */

	// Whenever the model changes, set a timeout
	// that will re-render the view's template
	// and update the DOM. Clear the timeout with
	// every call to make sure that the redraw
	// only happens once even if multiple changes
	// are made in the same run loop
	function modelChange() {
		clearTimeout(this.redrawTimeout);
		this.redrawTimeout = setTimeout(function() {
			this.redraw();
		}.bind(this));
	}

	// Create a new Todo when the ENTER
	// key is pressed
	function addTodo(e) {
		var val;
		if (e.which === ENTER_KEY) {
			val = e.currentTarget.value.trim();
			if (val) {
				this.model.add({
					id: Date.now(),
					title: val,
					completed: false
				});
			}
			e.preventDefault();
		}
	}

	// Remove the Todo when the 'x' is clicked
	function remove(e) {
		var todo = getTodoForEl(e.currentTarget, this.model);
		this.model.remove(todo);
	}

	// Set the completion state of a single model
	function toggleComplete(e) {
		var todo = getTodoForEl(e.currentTarget, this.model);
		todo.set('completed', e.currentTarget.checked);
	}

	// Set the completion state of all models
	function toggleAll(e) {
		this.model.each(function(index, model) {
			model.set('completed', e.currentTarget.checked);
		});
	}

	// Start editing a Todo
	function startEditing(e) {
		var $el = $(e.currentTarget);
		$el.addClass('editing');
		$el.find('input.edit').focus();
	}

	// Commit the edit when the ENTER key
	// is pressed
	function editTodo(e) {
		var todo;
		var val;
		if (e.which === ENTER_KEY) {
			todo = getTodoForEl(e.currentTarget, this.model);
			val = e.currentTarget.value.trim();
			if (todo && val) {
				todo.set('title', val);
			}
			e.preventDefault();
		}
	}

	// Remove all completed Todos
	function removeCompleted() {
		this.model.removeCompleted();
	}

	/* ---- Private functions ---- */

	// Given an `el` that is a child of one of the `li`
	// elements, this function will find the `data-id` attribute
	// attribute on the `li` and then return the corresponding
	// model in `collection`
	function getTodoForEl(el, collection) {
		var id = $(el).parents('li').attr('data-id');
		return collection.first({id: parseInt(id, 10)});
	}

	return TodosView;

});
