/*global define: false */
define([
    // Application.
    'app',

    // Libraries.
    'jquery',
    'underscore',
    'backbone',
    'debug',

    // Modules
    'modules/alert'
],

function(app, $, _, Backbone, debug, Alert) {
    'use strict';

    var Base = {};

    // The base model extends Backbone.Model adding common attributes
    // and behaviours.
    Base.Model = Backbone.Model.extend({

        // Add trailing slash to Model url.
        url: function() {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + (origUrl.charAt(origUrl.length - 1) === '/' ? '' : '/');
        },

        initialize: function() {
            debug.info('Entering Base.Model.initialize()...');

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
            debug.info('Entering Base.Model.save()...');

            options = options || {};

            // Handle non-200 HTTP response.
            options.error = function(model, xhr, options) {
                options.alerts.add(new Alert.Model({msg: '*cough* *cough* Sorry. Please try again.', level: 'danger'}));
            };

            return Backbone.Model.prototype.save.call(this, attributes, options);
        },

        fetch: function(options) {
            debug.info('Entering Base.Model.fetch()...');

            options = options || {};

            // Handle non-200 HTTP response.
            options.error = function(model, xhr, options) {
                debug.debug('options.error xhr = [' + JSON.stringify(xhr) + ']');
                debug.debug('options.error xhr = [' + JSON.stringify(options) + ']');
                options.alerts.add(new Alert.Model({msg: '*cough* *cough* Sorry. Please try again.', level: 'danger'}));
                // TODO: No response should be a 'No Internet Connection.'
            };

            return Backbone.Model.prototype.fetch.call(this, options);
        },

        destroy: function(options) {
            debug.info('Entering Base.Model.destroy()...');

            options = options || {};

            // Handle non-200 HTTP response.
            options.error = function(model, xhr, options) {
                options.alerts.add(new Alert.Model({msg: '*cough* *cough* Sorry. Please try again.', level: 'danger'}));
            };

            return Backbone.Model.prototype.destroy.call(this, options);
        }
    });

    // Required, return the module for AMD compliance.
    return Base;

});
