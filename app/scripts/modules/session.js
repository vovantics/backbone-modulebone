/*global define: false */
define([
    // Application.
    'app',

    // Libraries.
    'backbone',
    'debug',

    // Views
    'modules/session/views',

    // Modules
    'modules/base',
    'modules/alert',

    // Plugins
    'backbone.subroute'
],

function(app, Backbone, debug, Views, Base, Alert) {
    'use strict';

    // Create a new module
    var Session = app.module();

    // Session Router
    // -----------

    Session.Router = Backbone.SubRoute.extend({

        routes: {
            'login?next=:next': 'login',
            'login': 'login'
        },

        initialize: function(options) {
            debug.info('Entering Session.Router.initialize()...');

            this.session = options.session;
            this.alerts = options.alerts;
        },

        before: function( route ) {
            debug.info('Entering Session.Router.before(' + route + ')...');
        },

        login: function(next) {
            app.router.anonymousRequired(function() {
                debug.info('Entering Session.Router.login(' + next + ')...');

                // Use the empty layout and set views.
                app.useLayout('splash').setViews({

                    // Attach the form View to #container-content element.
                    '#container-alert': new Alert.Views.List({
                        collection: this.alerts
                    }),

                    // Attach the form View to #container-content element.
                    '#container-content': new Session.Views.Login({
                        model: this.session,
                        alerts: this.alerts,
                        next: next !== undefined ? decodeURIComponent(next) : null
                    })

                }).render();
            });
        }

    });

    // Session Model
    // -------------

    Session.Model = Base.Model.extend({

        url: 'http://' + app.serverHost + '/session/',

        // Default attributes for the session.
        defaults: {
            auth: false
        },

        initialize: function() {
            debug.info('Entering Session.Model.initialize()...');

            Base.Model.prototype.initialize.call(this);
        },

        isAuthenticated: function() {
            return this.get('auth');
        },

        // The callback function that is called when this model's data
        // is returned by the server, in fetch, and save. Returns the
        // attributes hash to be set on the model
        parse: function(response) {
            debug.info('Entering Session.Model.parse()...');

            if (response.status === 'success' && response.data.auth === true) {
                this.unset('email', {silent: true});
                this.unset('password', {silent: true});
                return {
                    auth: response.data.auth,
                    username: response.data.username,
                    id: response.data.id
                };
            }
            else {
                return false;
            }
        },

        // Default model.destroy() sends a DELETE request to the
        // server to delete a REST resource. Override the session
        // delete method to also clear the model's attributes.
        destroy: function(options) {
            debug.info('Entering Session.Model.destroy()...');

            options = options || {};

            Backbone.Model.prototype.destroy.call(this, options);

            this.clear();
        }
    });

    // Session Views
    // ----------

    // Attach the Views sub-module into this module.
    Session.Views = Views;

    // Required, return the module for AMD compliance.
    return Session;

});