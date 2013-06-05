/*global define: false */
define([
    // Application.
    'app',

    // Libraries.
    'backbone',
    'debug',

    // Modules.
    'modules/alert'
],
function(app, Backbone, debug, Alert) {
    'use strict';

    var Header = app.module();

    Header.Views.Nav = Backbone.View.extend({
        template: 'header/nav',

        // Delegated events for nav controls.
        events: {
            'click #logout':        'logoutOnClick'
        },

        initialize: function(options) {
            debug.info('Entering Header.Views.Nav.initialize()...');

            this.alerts = this.options.alerts;

            // Re-render the nav when the session is destroyed.
            this.model.on('destroy', function() {
                debug.debug('Session destroyed cid=[' + this.model.cid + '] model=[' + JSON.stringify(this.model) + ']');
                this.render();
            }, this);
        },

        beforeRender: function() {
            debug.info('Entering Header.Views.Nav.beforeRender()...');
        },

        // Provides the view with this collection's data.
        serialize: function() {
            debug.info('Entering Header.Views.Nav.serialize()...');

            return {
                appname: app.name,
                isAuthenticated: this.model.get('auth'),
                username: this.model.get('username')
            };
        },

        // The callback function that removes the session, destroying
        // the model.
        logoutOnClick: function( e ) {
            debug.info('Entering Header.Views.Nav.logoutOnClick()...');

            // Cancel default action of the click event.
            e.preventDefault();

            // Create reference to `this` to be used within callbacks.
            var that = this;

            // Destroy the session.
            this.model.destroy({
                success: function(model, response, options){
                    if (response.status === 'fail') {
                        that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                    }
                    else {
                        debug.debug('Session destroyed cid=[' + that.model.cid + '] model=[' + JSON.stringify(that.model) + ']');
                        that.alerts.add(new Alert.Model({msg: 'You were logged out.', level: 'info'}));
                        app.router.navigate('', {trigger: true});
                    }
                },
                alerts: that.alerts
            });
        }
    });

    // Required, return the module for AMD compliance.
    return Header;

});
