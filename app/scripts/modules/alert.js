define([
    // Application.
    "app",

    'bootstrap'
],

function(app) {

    var Alert = app.module();

    // Alert Model
    // ----------

    Alert.Model = Backbone.Model.extend({

        // Default attributes for the alert.
        defaults: {
            timeout: 2, // In seconds.
            msg: '',
            level: '' // "warn" (yellow), "error" (red), "success" (green) or "info" (blue)
        },

        initialize: function() {
            _.bindAll(this, "timedOut");
            if (this.get('level') !== 'danger') {
                setTimeout(this.timedOut, this.get("timeout") * 1000.0);
            }
        },

        timedOut: function() {
            this.trigger("timeout");
        }
    });

    // Alert Collection
    // ---------------

    // The collection of todos is backed by *localStorage* instead of a remote
    // server.
    Alert.Collection = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Alert.Model

    });

    // Alert Views
    // ----------

    Alert.Views.List = Backbone.View.extend({

        tagName: 'div id="messages"',

        initialize: function() {
            debug.info("Entering Alert.Views.List.initialize()...");

            // When model is added to this collection, insert item
            // view.
            this.collection.on("add", function(item) {
                alert("ALERT ADDED TO COLLECTION! item=[" + JSON.stringify(item) + "]");    // TODO: Remove

                // Change the state of the layout.
                if (this.collection.length > 0 && !$('#layout').hasClass('has-alerts')) {
                    $('#layout').addClass('has-alerts');
                }

                this.insertView(new Alert.Views.Item({
                    model: item
                })).render();
            }, this);

            // When model is removed from this collection, restore
            // layout to its original state.
            this.collection.on("remove", function(item) {
                if (this.collection.length === 0 && $('#layout').hasClass('has-alerts')) {
                    $('#layout').removeClass('has-alerts');
                }
            }, this);
        },

        beforeRender: function() {
            debug.info("Entering Alert.Views.List.beforeRender()...");

            // Change the state of the layout.
            if (this.collection.length > 0 && !$('#layout').hasClass('has-alerts')) {
                $('#layout').addClass('has-alerts');
            }

            this.collection.each(function(item) {
                this.insertView(new Alert.Views.Item({
                    model: item
                })).render();
            }, this);
        },

        afterRender: function() {
            // Change the state of the layout.
            /*if (this.collection.length > 0) {
                $('#layout').addClass('has-alerts');
            }*/
        }
    });

    Alert.Views.Item = Backbone.View.extend({
        template: "alert/item",

        tagName: "div",

        // Delegated events specific to an item.
        events: {
            "click .alert":    "removeOnClick"
        },

        initialize: function() {
            debug.info("Entering Alert.Views.Item.initialize()...");

            // Binds the remove callback function to this
            // model's timeout event.
            this.model.on("timeout", function() {
                this.removeItem();
            }, this);

            // Removes this view from the DOM, and calls stopListening
            // to remove any bound events that the view has listenTo'd.
            this.model.on("destroy", function() {
                this.remove();
            }, this);
        },

        // Provides the view with this collection's data.
        serialize: function() {
            debug.info("Entering Alert.Views.Item.serialize()...");

            return {
                msg: this.model.get('msg'),
                level: this.model.get('level')
            };
        },

        removeOnClick: function(e) {
            debug.info("Entering Alert.Views.Item.removeOnClick()...");

            // Cancel default action of the click event.
            //e.preventDefault();

            this.removeItem();
        },

        removeItem: function() {
            debug.info("Entering Alert.Views.Item.remove()...");

            // Fade the item out.
            this.$el.addClass('animated fadeOut');

            // Trigger the close event so Twitter Bootstrap's Alert
            // script removes the alert from the DOM.
            //this.$el.trigger('close');
            //this.$el.find(".alert").alert('close');

            // Remove the model from the collection.
            //this.model.destroy();
            var that = this;
            setTimeout(function() {
                that.model.destroy();
            }, 500);
        }

    });

    // Required, return the module for AMD compliance.
    return Alert;

});
