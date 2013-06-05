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
    'modules/alert',
    'modules/utils',
    'modules/macros',

    'jquery.validate',
    'bootstrap'
],
function(app, $, _, Backbone, debug, Alert, Utils) {
    'use strict';

    var Views = {};

    Views.Login = Backbone.View.extend({
        template: 'session/login',

        tagName: 'div id="session-login-outer"',

        // Delegated events for creating new items.
        events: {
            'submit form#form-session-login':       'createOnSubmit'
        },

        initialize: function(options) {
            debug.info('Entering Views.Login.initialize()...');

            this.alerts = this.options.alerts;
            this.next = this.options.next;
        },

        serialize: function() {
            debug.info('Entering Views.Login.serialize()...');

            var form = {
                id: 'form-session-login',
                classNames: ['inset'],
                fields: [
                    { label: 'Email address', name: 'email', required: true, inputClassNames: ['first'] },
                    { label: 'Password', name: 'password', type: 'password', required: true, inputClassNames: ['last'] }
                    /*{ label: 'Remember me', type: 'options',
                        options: [
                            { label: 'Remember me', name: 'remember_me', value: 'yes' }
                        ], required: true }*/
                ],
                buttons: [
                    { id: 'btn-login', classNames: [ 'btn', 'btn-block' ], label : 'Log me in!' }
                ]
            };

            return { form: form };
        },

        afterRender: function() {
            debug.info('Entering Views.Login.afterRender()...');

            this.$('#form-session-login').validate({
                highlight: function(element) {
                    $(element).parent('div').parent('div').addClass('error');
                },
                unhighlight: function(element) {
                    $(element).parent('div').parent('div').removeClass('error');
                },
                errorPlacement: function(error, element) {}
            });
        },

        createOnSubmit: function(e) {
            debug.info('Entering Views.Login.createOnSubmit()...');

            // Cancel default action of the submit event.
            e.preventDefault();

            // Set login button state to loading.
            this.$('#form-session-login button').button('loading');

            // Create reference to `this` to be used within callbacks.
            var that = this;

            // Construct array of all input elements that have a name
            // attribute. Ex. {name: "John Smith", age: 34}
            var arr = this.$('#form-session-login').serializeArray();
            var data = Utils.foldForm(arr);

            debug.debug('Session before save cid=[" + this.model.cid + "] model=[" + JSON.stringify(this.model) + "]');
            this.model.save(data, {
                success: function(model, response, options){
                    if (response.status === 'fail') {
                        // Display alerts.
                        _.each(response.data, function(message) {
                            that.alerts.add(new Alert.Model({msg: message, level: 'error'}));
                        });
                    }
                    else {
                        if (response.data.status === 'inactive') {
                            debug.debug('User is inactive.');
                            // Clear each form field.
                            _.each(arr, function(field) {
                                that.$('#' + field.name).val('');
                            });
                            that.alerts.add(new Alert.Model({msg: 'Welcome back! Please check your email for instructions to reactivate this account.', level: 'error'}));
                        }
                        else {
                            debug.debug('User is active.');
                            if (that.next !== null) {
                                app.router.navigate(that.next, {trigger: true});
                            }
                            else {
                                app.router.navigate('accounts/' + model.get('username') + '/', {trigger: true});
                            }
                        }
                    }
                },
                alerts: that.alerts
            });

            // Reset login button state.
            this.$('#form-session-login button').button('reset');
        }
    });

    return Views;

});
