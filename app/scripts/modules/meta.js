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
    'modules/base',
    'modules/alert',
    'modules/utils'
],

function(app, $, _, Backbone, debug, Base, Alert, Utils) {
    'use strict';

    var Meta = app.module();

    Meta.Views.Landing = Backbone.View.extend({
        template: 'meta/landing',

        initialize: function() {
            debug.info('Entering Meta.Views.Landing.initialize()...');
        }
    });

    // Meta Mail Model
    // ---------------

    Meta.Mail = Base.Model.extend({

        urlRoot: 'http://' + app.serverHost + '/mail/',

        initialize: function() {
            debug.info('Entering Meta.Mail.initialize()...');
            Base.Model.prototype.initialize.call(this);
        }
    });

    Meta.Views.Contact = Backbone.View.extend({
        template: 'meta/contact',

        // Delegated events for creating new items.
        events: {
            'submit form#form-meta-contact':       'sendMailOnSubmit'
        },

        initialize: function() {
            debug.info('Entering Meta.Views.Contact.initialize()...');
            this.alerts = this.options.alerts;
        },

        beforeRender: function() {
            debug.info('Entering Meta.Views.Contact.beforeRender()...');
        },

        afterRender: function() {
            debug.info('Entering Meta.Views.Contact.afterRender()...');

            this.$('#form-meta-contact').validate({
                highlight: function(element) {
                    $(element).parent('div').parent('div').addClass('error');
                },
                unhighlight: function(element) {
                    $(element).parent('div').parent('div').removeClass('error');
                },
                errorPlacement: function(error, element) {}
            });
        },

        sendMailOnSubmit: function(e) {
            debug.info('Entering Meta.Views.Contact.sendMailOnSubmit()...');

            // Cancel default action of the submit event.
            e.preventDefault();

            // Construct array of all input elements that have a name
            // attribute. Ex. {name: "John Smith", age: 34}
            var arr = this.$('#form-meta-contact').serializeArray();
            var data = Utils.foldForm(arr);

            // Create reference to `this` to be used within callbacks.
            var that = this;

            this.model.save(data, {
                success: function(model, response, options){
                    if (response.status === 'fail') {
                        that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                    }
                    else {
                        // Clear each form field.
                        _.each(arr, function(field) {
                            that.$('#' + field.name).val('');
                        });
                        that.alerts.add(new Alert.Model({msg: 'Thanks for your message. We\'ll get back to you shortly.', level: 'success'}));
                    }
                },
                alerts: that.alerts
            });
        },

        serialize: function() {
            debug.info('Entering Meta.Views.Contact.serialize()...');

            var form = {
                id: 'form-meta-contact',
                fields : [
                    { label: 'Full Name', name: 'full_name', value: '', required: true },
                    { label: 'Email', name: 'email', value: '', required: true },
                    { label: 'Subject', name: 'subject', value: '', required: true },
                    { label: 'Message', name: 'message', type: 'textarea', value: '', required: true }
                ],
                buttons : [
                    { classNames : [ 'btn', 'btn-primary' ], label : 'Send Message' }
                ]
            };

            return { form: form };
        }

    });

    Meta.Views.Footer = Backbone.View.extend({
        template: 'meta/footer',

        initialize: function() {
            debug.info('Entering Meta.Views.Footer.initialize()...');
        }
    });

    // Required, return the module for AMD compliance.
    return Meta;

});
