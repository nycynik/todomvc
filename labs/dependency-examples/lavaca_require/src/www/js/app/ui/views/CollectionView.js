define(function(require) {

	var View = require('lavaca/mvc/View');
	var Promise = require('lavaca/util/Promise');
	var equals = require('mout/object/equals');
	var $ = require('$');

	/**
	 * A view for synchronizing a collection of models with sub views
	 * @class app.ui.views.CollectionView
	 * @super lavaca.mvc.View
	 */
	var CollectionView = View.extend(function CollectionView() {
		// Call the super class' constructor
		View.apply(this, arguments);
		this.collectionViews = [];
		this.mapEvent({
			model: {
				'addItem': this.onItemEvent.bind(this),
				'moveItem': this.onItemEvent.bind(this),
				'removeItem': this.onItemEvent.bind(this),
				'changeItem': this.onItemEvent.bind(this)
			}
		});
		this.on('removeView', this.onRemoveView.bind(this));
		this.render();
	},{
		/**
		 * A class name added to the view container
		 * @property className
		 * @type String
		 */
		className: 'collection-view',
		/**
		 * A type of element created to attach each item view
		 * @property itemEl
		 * @type String
		 */
		itemEl: 'div',
		/**
		 * The view type used for each item view
		 * @property itemEl
		 * @type lavaca.mvc.View
		 */
		TView: View,
		/**
		 * Initializes and renders all item views to be shown
		 * @method render
		 */
		render: function() {
			var models = this.model.filter(this.modelFilter.bind(this)),
					fragment = document.createDocumentFragment(),
					view;
			models.forEach(function(item) {
				view = this.addItemView(item);
				fragment.appendChild(view.el[0]);
			}.bind(this));
			this.trigger('rendersuccess', {html: fragment});
			return new Promise().resolve();
		},
		/**
		 * Creates a new view and inserts it into the DOM at the
		 * provided index
		 * @method addItemView
		 * @param {Object} [model] the model for the view
		 * @param {Number} [index] the index to insert the view in the DOM
		 */
		addItemView: function(model, index) {
			var view = new this.TView($('<' + this.itemEl + '>'), model, this),
					count = this.collectionViews.length,
					insertIndex = index === null || index === undefined ? count : index;
			this.collectionViews.splice(insertIndex, 0, view);
			if (insertIndex === 0) {
				this.el.prepend(view.el[0]);
			} else {
				this.el
					.find(this.itemEl)
					.eq(insertIndex-1)
					.after(view.el[0]);
			}
			return view;
		},
		/**
		 * Remove and disposes a view
		 * @method removeItemView
		 * @param {Number} [index] the index of the view to remove
		 */
		removeItemView: function(index) {
			var view = this.collectionViews.splice(index, 1)[0];
			view.el.remove();
			view.dispose();
		},
		/**
		 * Returns the index of a view
		 * @method getViewsIndexByModel
		 * @param {Object} [model] the model of the view to find
		 */
		getViewsIndexByModel: function(model) {
			var collectionViewIndex = -1,
					modelObj = model.toObject();
			this.collectionViews.every(function(view, i) {
				if (equals(view.model.toObject(), modelObj)) {
					collectionViewIndex = i;
					return false;
				}
				return true;
			});
			return collectionViewIndex;
		},
		/**
		 * Returns the index of a model in an array of models
		 * @method getModelIndexInModels
		 * @param {Object} [model] needle
		 * @param {Array} [models] haystack
		 */
		getModelIndexInModels: function(model, models) {
			var index = -1,
					modelObj;
			modelObj = model.toObject();
			models.every(function(item, i) {
				if (equals(item.toObject(), modelObj)) {
					index = i;
					return false;
				}
				return true;
			});
			return index;
		},
		/**
		 * The filter to run against the collection
		 * @method modelFilter
		 * @param {Number} [i] the index
		 * @param {Object} [model] the model
		 */
		modelFilter: function() {
			return true;
		},
		/**
		 * Event handler for all collection events that produces all add, remove, and move actions 
		 * @method modelFilter
		 * @param {Obejct} [e] the event
		 */
		onItemEvent: function() {
			var models = this.model.filter(this.modelFilter.bind(this)),
					i = -1,
					model,
					view,
					viewIndex,
					oldIndex,
					modelIndex,
					temp;
			// Add new views    
			while(model = models[++i]) {
				viewIndex = this.getViewsIndexByModel(model);
				if (viewIndex === -1) {
					this.addItemView(model, i);
				}
			}
			// Remove Old Views 
			i = -1;
			while(view = this.collectionViews[++i]) {
				modelIndex = this.getModelIndexInModels(view.model, models);
				if (modelIndex === -1) {
					this.removeItemView(i);
				}
			}
			// Move any existing views
			i = -1;
			while(model = models[++i]) {
				oldIndex = this.getViewsIndexByModel(model);
				if (oldIndex !== i) {
					this.swapViews(this.collectionViews[i], this.collectionViews[oldIndex]);
					temp = this.collectionViews[oldIndex];
					this.collectionViews[oldIndex] = this.collectionViews[i];
					this.collectionViews[i] = temp;
				}
			}
		},
		/**
		 * Swaps two views in the DOM
		 * @method swapViews
		 * @param {Obejct} [viewA] a view
		 * @param {Obejct} [viewB] another view
		 */
		swapViews: function(viewA, viewB) {
			var a = viewA.el[0],
					b = viewB.el[0],
					aParent = a.parentNode,
					aSibling = a.nextSibling === b ? a : a.nextSibling;
				b.parentNode.insertBefore(a, b);
				aParent.insertBefore(b, aSibling);
		},
		/**
		 * Removes a view when removeView event it triggered
		 * @method swapViews
		 * @param {Obejct} [viewA] a view
		 * @param {Obejct} [viewB] another view
		 */
		onRemoveView: function(e) {
			this.model.remove(e.model);
		}

	});

	return CollectionView;

});
