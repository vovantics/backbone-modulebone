/*global define: false, Store: false */
define([
    // Application.
    'app',

    // Libraries.
    'backbone',

    // Modules.
    'modules/todo/constants',
    'modules/todo/views',

    // Plugins
    //"vendor/backbone/backbone-localstorage"
    'backbone.localstorage'
],
function(app, Backbone, Constants, Views) {
    'use strict';

    // Create a new module
    var Todo = app.module();

    // Todo Router
    // -----------

    Todo.Router = Backbone.SubRoute.extend({

        routes: {
            '': 'index',
            '*filter': 'setFilter'
        },

        initialize: function() {
            console.log('Entering Todo.Router.initialize()...');

            // Create a new Todo List.
            this.list = new Todo.List({ namespace: 'todos' });
            //var sampleTodo = new Todo.Model({title: 'Learn Models', completed: true});
            //this.list.add(sampleTodo);

            // Fetch any preexisting todos that might be saved in *localStorage*
            this.list.fetch();
        },

        before: function( route ) {
            console.log('Entering Todo.Router.before(' + route + ')...');

            // Use the todo layout and set views.
            app.useLayout('todo').setViews({

                // Attach the form View to #container-form element.
                '#container-form': new Todo.Views.Form({
                    collection: this.list
                }),

                // Attach the toggle View to #container-toggle element.
                '#container-toggle': new Todo.Views.ToggleAll({
                    collection: this.list
                }),

                // Attach the list View to #container-list element.
                '#container-list': new Todo.Views.List({
                    collection: this.list
                }),

                // Attach the stats View to #container-stats.
                '#container-stats': new Todo.Views.Stats({
                    collection: this.list
                })

            }).render();
        },

        index: function() {
            console.log('Entering Todo.Router.index()...');
        },

        setFilter: function( param ) {
            console.log('Entering Todo.Router.setFilter()...');
            console.log(param);

            // Set the current filter to be used
            var filterVal = param.trim() || '';

            // Trigger a filter event by this collection.
            this.list.trigger('filter', filterVal);
        }
    });

    // Todo Model
    // ----------

    // Our basic **Todo** model has `content` and `done` attributes.
    Todo.Model = Backbone.Model.extend({

        // Default attributes for the todo
        // and ensure that each todo created has `title` and `completed` keys.
        defaults: {
            title: '',
            completed: false
        },

        // Remove this Todo from *localStorage*.
        clear: function() {
            this.destroy();
        },

        // Toggle the `completed` state of this todo item.
        toggle: function() {
            this.save({
                completed: !this.get('completed')
            });
        }
    });

    // Todo Collection
    // ---------------

    // The collection of todos is backed by *localStorage* instead of a remote
    // server.
    Todo.List = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Todo.Model,

        initialize: function(options) {
            // Save all of the todo items under namespace.
            this.localStorage = new Store(options.namespace);
        },

        // Filter down the list of all todo items that are finished.
        completed: function() {
            console.log('Entering Todo.List.completed()...');
            return this.filter(function( todo ) {
                return todo.get('completed');
            });
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            console.log('Entering Todo.List.remaining()...');
            return this.without.apply( this, this.completed() );
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
            if ( !this.length ) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: function( todo ) {
            return todo.get('order');
        }

    });

    // Todo Views
    // ----------

    // Attach the Views sub-module into this module.
    Todo.Views = Views;

    // Attach the Constants sub-module into this module.
    Todo.Constants = Constants;

    // Required, return the module for AMD compliance
    return Todo;

});
