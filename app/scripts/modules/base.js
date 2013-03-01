define([
    // Application.
    "app",

    // Modules
    "modules/alert",

    'debug'
],

function(app, Alert) {

    var Base = {};

    // The base model extends Backbone.Model adding common attributes
    // and behaviours.
    Base.Model = Backbone.Model.extend({

        // Add trailing slash to Model url.
        url: function() {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
        },

        initialize: function() {
            debug.info("Entering Base.Model.initialize()...");

            // Hook into jquery
            // Use withCredentials to send the server cookies
            // The server must allow this through response headers
            $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
                options.xhrFields = {
                    withCredentials: true
                };
                jqXHR.setRequestHeader('Accept-Language', localStorage.getItem('locale'));
            });
        },

        save: function(attributes, options) {
            debug.info("Entering Base.Model.save()...");

            options || (options = {});

            // Handle non-200 HTTP response.
            options.error = function(model, xhr, options) {
                // TODO: Handle 300, 400, and 500 errors
                debug.debug("options.error xhr = [" + JSON.stringify(xhr) + "]");
                options.alerts.add(new Alert.Model({msg: 'No Internet Connection.', level: 'danger'}));
            };

            return Backbone.Model.prototype.save.call(this, attributes, options);
        },

        fetch: function(options) {
            debug.info("Entering Base.Model.fetch()...");

            options || (options = {});

            // Handle non-200 HTTP response.
            options.error = function(model, xhr, options) {
                options.alerts.add(new Alert.Model({msg: 'No Internet Connection.', level: 'danger'}));
            };

            return Backbone.Model.prototype.fetch.call(this, options);
        },

        destroy: function(options) {
            debug.info("Entering Base.Model.destroy()...");

            options || (options = {});

            // Handle non-200 HTTP response.
            options.error = function(model, xhr, options) {
                options.alerts.add(new Alert.Model({msg: 'No Internet Connection.', level: 'danger'}));
            };

            return Backbone.Model.prototype.destroy.call(this, options);
        }
    });

    // Required, return the module for AMD compliance.
    return Base;

});
