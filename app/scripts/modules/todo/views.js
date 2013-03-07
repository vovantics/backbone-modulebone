define([
  "app",

  "underscore",

  // Libs
  "backbone",

  // Modules
  "modules/todo/constants",

  "helpers"
],

function(app, _, Backbone, Constants) {

    var Views = {};

    Views.Form = Backbone.View.extend({
        template: "todo/form",

        inputId: '#new-todo',

        // Delegated events for creating new items.
        events: {
            'keypress #new-todo':       'createOnEnter'
        },

        // Callback function that creates new **Todo.Model** model
        // and persists it to *localStorage*.
        createOnEnter: function( e ) {
            console.log("Entering Views.Form.createOnEnter()...");

            // Do nothing if Enter key pressed or input value is blank.
            if (e.which !== Constants.ENTER_KEY || !this.$(this.inputId).val().trim() ) {
                return;
            }

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Create a new instance of a model within this collection.
            this.collection.create(this.newAttributes());

            // Clear input.
            this.$(this.inputId).val("");
        },

        // Generate the attributes for a new Todo item.
        newAttributes: function() {
            console.log("Entering Views.Form.newAttributes()...");

            return {
                title: this.$(this.inputId).val(),
                order: this.collection.nextOrder(),
                completed: false
            };
        }
    });

    Views.ToggleAll = Backbone.View.extend({

        template: "todo/toggle",

        inputId: '#toggle-all',

        // Delegated events for toggling items.
        events: {
            'click #toggle-all':        'toggleAllComplete'
        },

        // Callback function that sets each Todo items as
        // complete/incomplete.
        toggleAllComplete: function() {
            console.log("Entering Views.ToggleAll.toggleAllComplete()...");

            var completed = this.$(this.inputId)[0].checked;

            this.collection.each(function( item ) {
                item.save({
                    'completed': completed
                });
            });
        }
    });

    // The view that comprises the DOM elements for a todo list.
    Views.List = Backbone.View.extend({

        tagName: 'ul id="todo-list"',

        // This view listens for changes to its collection,
        // re-rendering.
        initialize: function() {
            console.log("Entering Views.List.initialize()...");

            // Collection.fetch() will call reset() on success, which
            // in turn will trigger a "reset" event
            this.collection.on("reset", function() {
                this.render();
            }, this);

            // When model is added to this collection, insert item
            // view.
            this.collection.on("add", function(item) {
                this.insertView(new Views.Item({
                    model: item
                })).render();
            }, this);

            // Bind the filterAll callback to this collection to be
            // invoked whenever the filter event is triggered.
            this.collection.on("filter", function(filterVal) {
                this.filterAll(filterVal);
            }, this);
        },

        beforeRender: function() {
            console.log("Entering Views.List.beforeRender()...");

            // Insert each item view before render.
            this.collection.each(function(item) {
                console.log("Insert view for item in collection");
                this.insertView(new Views.Item({
                    model: item
                }));
            }, this);
        },

        // Callback function that hides/unhides this collection's
        // items.
        filterAll : function (filterVal) {
            console.log("Entering Views.List.filterAll()...");

            this.collection.each(function( item ) {
                // Trigger a visible event by this item.
                item.trigger("visible", filterVal);
            });
        }
    });

    // The view that comprises the DOM element for a todo item.
    Views.Item = Backbone.View.extend({
        template: "todo/item",

        tagName: "li",

        inputClass: '.edit',

        // Delegated events specific to an item.
        events: {
            "click .toggle":    "toggleCompleted",
            'dblclick label':   'edit',
            'click .destroy':   'clear',
            'keypress .edit':   'updateOnEnter',
            'blur .edit':       'close'
        },

        // This view listens for changes to its model. It re-renders
        // when its model is changed. It removes itself when its model
        // is destroyed. It hides/unhides itself when its model
        // triggers a visible event.
        initialize: function() {
            console.log("Entering Views.Item.initialize()...");

            // Re-render this view after todo is editted.
            this.model.on("change", function() {
                this.render();
            }, this);

            // Removes this view from the DOM, and calls stopListening
            // to remove any bound events that the view has listenTo'd.
            this.model.on("destroy", function() {
                this.remove();
            }, this);

            // Binds the toggleVisible callback function to this
            // model's visible event.
            this.model.on("visible", function(filterVal) {
                this.toggleVisible(filterVal);
            }, this);
        },

        // The traditional `render` function is now completed managed
        // by LayoutManager (unless it's overrided) and is not the
        // function that should be used to add new views.
        // The beforeRender function is invoked before the view is
        // rendered.
        // Sets the DOM element class to completed if the todo item is complete.
        beforeRender: function() {
            console.log("Entering Views.Item.beforeRender()...");

            // Toggles the todo item as complete/incomplete.
            this.$el.toggleClass( 'completed', this.model.get('completed') );

            // Toggles the todo item as visible/hidden.
            this.toggleVisible();
        },

        // Provides the template with the model data to render.
        serialize: function() {
            console.log("Entering Views.Item.serialize()...");

            return {
                completed: this.model.get("completed"),
                title: this.model.get("title")
            };
        },

        // The callback function that toggles the todo item as visible
        // /hidden.
        toggleVisible : function (filterVal) {
            console.log("Entering Views.Item.toggleVisible()...");

            this.$el.toggleClass( 'hidden',  this.isHidden(filterVal));
        },

        // Returns `false` if the todo item is visible and true if the
        // todo item is hidden.
        isHidden : function (filterVal) {
            console.log("Entering Views.Item.isHidden()...");

            var isCompleted = this.model.get('completed');
            return ( // hidden cases only
                (!isCompleted && filterVal === 'completed') ||
                (isCompleted && filterVal === 'active')
            );
        },

        // The callback function that toggles the `"completed"` state
        // of the model.
        toggleCompleted: function() {
            console.log("Entering Views.Todo.toggleCompleted()...");

            this.model.toggle();
        },

        // Callback function that switches this todo item into
        // `"editing"` mode, displaying the input field.
        edit: function() {
            console.log("Entering Views.Item.edit()...");

            this.$el.addClass('editing');
            this.$(this.inputClass).focus();
        },

        // Callback function that closes the `"editing"` mode, saving
        // changes to the todo item.
        close: function() {
            console.log("Entering Views.Todo.close()...");

            var value = this.$(this.inputClass).val().trim();

            if ( value ){
                this.model.save({ title: value });
            } else {
                this.clear();
            }

            this.$el.removeClass('editing');
        },

        // The callback function that listens to key input and calls
        // the close function when the `enter` key is hit, signifying
        // that the user is done editing the todo.
        updateOnEnter: function( e ) {
            console.log("Entering Views.Item.updateOnEnter()...");

            if ( e.keyCode === Constants.ENTER_KEY ) {
                this.close();
            }
        },

        // The callback function that removes the todo item,
        // destroying the model.
        clear: function() {
            console.log("Entering Views.Item.clear()...");

            this.model.clear();
        }
    });

    // The view that comprises the DOM elements for the stats of a
    // todo list.
    Views.Stats = Backbone.View.extend({
        template: "todo/stats",

        // Delegated event for clearing completed todo items.
        events: {
            'click #clear-completed':   'clearCompleted'
        },

        // This view listens to changes to its collection,
        // re-rendering when any event is triggered.
        initialize: function() {
            console.log("Entering Views.Stats.initialize()...");

            // Refresh the statistics when this collection changes
            this.collection.bind( 'all', this.render, this );
        },

        // Provides the view with this collection's data.
        serialize: function() {
            console.log("Entering Views.Stats.serialize()...");

            var completed = this.collection.completed().length;
            var remaining = this.collection.remaining().length;

            if ( this.collection.length ) {
                return {
                    completed: completed,
                    remaining: remaining
                };
            }
            else {
                return {
                    completed: 0,
                    remaining: 0
                };
            }
        },

        // The callback function that clears all completed todo items,
        // destroying their models.
        clearCompleted: function() {
            console.log("Entering Views.Form.clearCompleted()...");

            // Iterates over a list of completed items in this
            // collection, yielding each in turn to an iterator
            // function that destroys them.
            _.each( this.collection.completed(), function( todo ) {
                todo.destroy();
            });

            return false;
        }
    });

    return Views;

});
