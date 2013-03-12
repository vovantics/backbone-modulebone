define([
    "app",

    // Libs
    "underscore",
    "backbone",

    // Modules
    "modules/session",
    "modules/alert",
    'modules/account',
    "modules/utils",
    'modules/macros',

    //"text!/templates/account/days.html",

    'jquery.validate'
],

function(app, _, Backbone, Session, Alert, Account, Utils, Macros/*, daysHtml*/) {

    var Views = {};

    // Links in account menu view.
    var menuItems = [
    { href: 'accounts/edit', caption: 'Profile' },
    { href: 'accounts/password/change', caption: 'Change Password' },
    { href: 'accounts/settings', caption: 'Settings' }
    ];

    Views.Menu = Backbone.View.extend({
        template: 'account/menu',

        // Delegated events for creating new items.
        events: {
            //'click a':       'triggerMenuChange'
        },

        initialize: function() {
            debug.info("Entering Views.Menu.initialize()...");
        },

        beforeRender: function() {
            debug.info("Entering Views.Menu.beforeRender()...");
        },

        serialize: function() {
            debug.info("Entering Views.Menu.serialize()...");

            return {
                menuItems: menuItems,
                activePage: Backbone.history.fragment
            };
        }
    });

    Views.Profile = Backbone.View.extend({
        template: "account/profile",

        // Delegated events for creating new items.
        events: {
            //'click #submit':       'createOnSubmit'
        },

        initialize: function() {
            debug.info("Entering Views.Profile.initialize()...");
        },

        beforeRender: function() {
            debug.info("Entering Views.Profile.beforeRender()...");
        },

        serialize: function() {
            debug.info("Entering Views.Profile.serialize()...");

            return { username: this.model.get('username') };
        }
    });

    Views.Deactivate = Backbone.View.extend({
        template: "account/deactivate",

        // Delegated events for creating new items.
        events: {
            'submit form#form-account-deactivate':       'deleteOnSubmit'
        },

        initialize: function(options) {
            debug.info("Entering Views.Deactivate.initialize()...");
            this.session = this.options.session;
            this.alerts = this.options.alerts;
        },

        beforeRender: function() {
            debug.info("Entering Views.Deactivate.beforeRender()...");
        },

        afterRender: function() {
            debug.info("Entering Views.Deactivate.afterRender()...");

            this.$("#form-account-deactivate").validate({
                highlight: function(element) {
                    $(element).parent('div').parent('div').addClass('error');
                },
                unhighlight: function(element) {
                    $(element).parent('div').parent('div').removeClass('error');
                },
                errorPlacement: function(error, element) {}
            });
        },

        deleteOnSubmit: function(e) {
            debug.info("Entering Views.Deactivate.deleteOnSubmit()...");

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Create reference to `this` to be used within callbacks.
            var that = this;

            this.model.destroy({
                success: function(model, response, options){
                    if (response.status == 'fail') {
                        // Display alerts.
                        _.each(response.data, function(message) {
                            that.alerts.add(new Alert.Model({msg: message, level: 'error'}));
                        });
                    }
                    else if (response.status == 'error') {
                        that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                    }
                    else {
                        that.alerts.add(new Alert.Model({msg: 'Your account has been deactivated.', level: 'success'}));
                        // The account model has been deleted.
                        // Now, delete the session model.
                        that.session.destroy({
                            async: false,
                            success: function(model, response, options){
                                if (response.status == 'fail') {
                                    that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                                }
                                else {
                                    that.alerts.add(new Alert.Model({msg: 'You were logged out.', level: 'info'}));
                                }
                            },
                            alerts: that.alerts
                        });

                        // Navigate to home page.
                        app.router.navigate('', {trigger: true});
                    }
                },
                alerts: that.alerts
            });
        },

        serialize: function() {
            debug.info("Entering Views.Deactivate.beforeRender()...");

            var formDeactivate = {
                id: 'form-account-deactivate',
                fields : [
                ],
                buttons : [
                    { classNames : 'btn', label : "No, I've changed my mind!", link : '/' },
                    { classNames : [ 'btn', 'btn-primary' ], label : "Deactivate my account" }
                ]
            };

            return { formDeactivate: formDeactivate };
        }
    });

    Views.Edit = Backbone.View.extend({
        template: "account/edit",

        // Delegated events for creating new items.
        events: {
            'submit form#form-account-edit':       'updateOnSubmit',
            'change #dob-month':       'updateDOBDaysOptions',
            'change #dob-year':       'updateDOBDaysOptions'
        },

        initialize: function(options) {
            debug.info("Entering Views.Edit.initialize()...");
            this.alerts = this.options.alerts;
        },

        beforeRender: function() {
            debug.info("Entering Views.Edit.beforeRender()...");
        },

        afterRender: function() {
            debug.info("Entering Views.Edit.afterRender()...");

            this.$("#form-account-edit").validate({
                highlight: function(element) {
                    $(element).parent('div').parent('div').addClass('error');
                },
                unhighlight: function(element) {
                    $(element).parent('div').parent('div').removeClass('error');
                },
                errorPlacement: function(error, element) {}
            });
        },

        updateDOBDaysOptions: function(e) {
            debug.info("Entering Views.Edit.updateDOBDaysOptions()...");

            // Generate options array.
            var options = Macros.getDaysInMonthAsOptions(this.$("#dob-month").val(), this.$("#dob-day").val(), this.$("#dob-year").val());

            // Compile template, generate HTML, and update DOB day options.
            var daysOptionsTemplate = Handlebars.compile('{{#each options}}<option value="{{id}}"{{#selected}} selected{{/selected}}>{{name}}</option>{{/each}}');
            // TODO: Doesn't work with yeoman build
            // var daysOptionsTemplate = Handlebars.compile(daysHtml);
            var output = daysOptionsTemplate({options : options});

            // Update #dob-day with new options.
            this.$("#dob-day").empty().append(output);
        },

        updateOnSubmit: function(e) {
            debug.info("Entering Views.Edit.updateOnSubmit()...");

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Construct array of all input elements that have a name
            // attribute. Ex. {name: "John Smith", age: 34}
            var arr = this.$('#form-account-edit').serializeArray();
            // Filter out fields that are prefixed with 'dob-'.
            var arrFiltered = _.reject(arr, function(field){ return field.name.substring(0, 4) === 'dob-'; });
            var data = Utils.foldForm(arrFiltered);
            // Concat dob- fields and merge with data.
            var dob = [this.$('#dob-year').val(), this.$('#dob-month').val(), this.$('#dob-day').val()].join('-');
            data = $.extend({}, data, {dob: dob});

            // Create reference to `this` to be used within callbacks.
            var that = this;

            this.model.save(data, {
                success: function(model, response, options){
                    if (response.status == 'fail') {
                        // Display alerts.
                        _.each(response.data, function(message) {
                            that.alerts.add(new Alert.Model({msg: message, level: 'error'}));
                        });
                    }
                    else if (response.status == 'error') {
                        that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                    }
                    else {
                        that.alerts.add(new Alert.Model({msg: 'Your profile has been updated.', level: 'success'}));
                    }
                },
                alerts: that.alerts
            });
        },

        serialize: function() {
            debug.info("Entering Views.Edit.serialize()...");

            var formEdit = {
                id: 'form-account-edit',
                values : this.model.toJSON(),
                fields : [
                    { label: 'First Name', name: 'first_name', inputClassNames: ['first'] },
                    { label: 'Last Name', name: 'last_name', inputClassNames: ['middle'] },
                    { label: 'Username', name: 'username', required: true, inputClassNames: ['middle'] },
                    { label: 'Email', name: 'email', required: true, inputClassNames: ['middle'] },
                    { label: 'Gender', name: 'gender', type: 'select',
                        options: [
                            { id: '', name: '---' },
                            { id: 'male', name: 'Male' },
                            { id: 'female', name: 'Female' }
                        ], inputClassNames: ['middle']
                    },
                    { label: 'DOB', name: 'dob', type: 'date', inputClassNames: ['middle'] },
                    { label: 'Phone', name: 'phone', inputClassNames: ['middle'] },
                    { label: 'Bio', name: 'bio', type: 'textarea', inputClassNames: ['middle'] },
                    { label: 'Website', name: 'url', inputClassNames: ['last'] }
                ],
                buttons : [
                    { classNames : [ 'btn', 'btn-primary' ], label : 'Save' },
                    { classNames : 'btn', label : 'Cancel', link : '/' }
                ],
                withLabel: true
            };

            return { formEdit: formEdit };
        }
    });

    Views.PasswordChange = Backbone.View.extend({
        template: "account/password_change",

        // Delegated events for creating new items.
        events: {
            'submit form#form-account-changepassword':       'updateOnSubmit'
        },

        initialize: function(options) {
            debug.info("Entering Views.PasswordChange.initialize()...");
            this.alerts = this.options.alerts;
        },

        beforeRender: function() {
            debug.info("Entering Views.PasswordChange.beforeRender()...");
        },

        afterRender: function() {
            debug.info("Entering Views.PasswordChange.afterRender()...");
            this.$("#form-account-changepassword").validate({
                highlight: function(element) {
                    $(element).parent('div').parent('div').addClass('error');
                },
                unhighlight: function(element) {
                    $(element).parent('div').parent('div').removeClass('error');
                },
                errorPlacement: function(error, element) {}
            });
        },

        updateOnSubmit: function(e) {
            debug.info("Entering Views.PasswordChange.updateOnSubmit()...");

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Construct array of all input elements that have a name
            // attribute. Ex. {name: "John Smith", age: 34}
            var arr = this.$('#form-account-changepassword').serializeArray();
            var data = Utils.foldForm(arr);

            // Create reference to `this` to be used within callbacks.
            var that = this;

            this.model.save(data, {
                success: function(model, response, options){
                    if (response.status == 'fail') {
                        // Display alerts.
                        _.each(response.data, function(message) {
                            that.alerts.add(new Alert.Model({msg: message, level: 'error'}));
                        });

                        // Clear each form field.
                        _.each(arr, function(field) {
                            that.$('#' + field.name).val('');
                        });

                        // Focus password field
                        that.$('#password').focus();
                    }
                    else if (response.status == 'error') {
                        that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));

                        // Clear each form field.
                        _.each(arr, function(field) {
                            that.$('#' + field.name).val('');
                        });

                        // Focus password field
                        that.$('#password').focus();
                    }
                    else {
                        that.alerts.add(new Alert.Model({msg: 'Your password has been updated.', level: 'success'}));

                        // Clear each form field.
                        _.each(arr, function(field) {
                            that.$('#' + field.name).val('');
                        });
                    }
                },
                alerts: that.alerts
            });
        },

        serialize: function() {
            debug.info("Entering Views.PasswordChange.serialize()...");

            var form = {
                id: 'form-account-changepassword',
                fields : [
                    { label: 'New password', name: 'password', type: 'password', required: true },
                    { label: 'New password again', name: 'password_again', type: 'password', required: true }
                ],
                buttons : [
                    { classNames : [ 'btn', 'btn-primary' ], label : 'Change Password' }
                ],
                withLabel: true
            };

            return { form: form };
        }
    });

    Views.PasswordReset = Backbone.View.extend({
        template: "account/password_reset",

        // Delegated events for creating new items.
        events: {
            'submit form#form-account-resetpassword':       'sendInstructionsOnSubmit'
        },

        initialize: function(options) {
            debug.info("Entering Views.PasswordReset.initialize()...");
            this.alerts = this.options.alerts;
        },

        beforeRender: function() {
            debug.info("Entering Views.PasswordReset.beforeRender()...");
        },

        afterRender: function() {
            debug.info("Entering Views.PasswordReset.afterRender()...");
            this.$("#form-account-resetpassword").validate({
                highlight: function(element) {
                    $(element).parent('div').parent('div').addClass('error');
                },
                unhighlight: function(element) {
                    $(element).parent('div').parent('div').removeClass('error');
                },
                errorPlacement: function(error, element) {}
            });
        },

        serialize: function() {
            debug.info("Entering Views.PasswordReset.serialize()...");

            var form = {
                id: 'form-account-resetpassword',
                fields : [
                    { label: 'Your email', name: 'email', value: '', required: true }
                ],
                buttons : [
                    { classNames : [ 'btn', 'btn-primary' ], label : 'Send instructions' }
                ]
            };

            return { form: form };
        },

        sendInstructionsOnSubmit: function(e) {
            debug.info("Entering Views.PasswordReset.sendInstructionsOnSubmit()...");

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Create reference to `this` to be used within callbacks.
            var that = this;

            this.model.save(
            {
                'email' : this.$('#email').val()
            },
            {
                success: function(model, response, options){

                    if (response.status == 'fail') {
                        // Display alerts.
                        _.each(response.data, function(message) {
                            that.alerts.add(new Alert.Model({msg: message, level: 'error'}));
                        });

                        // Clear each form field.
                        that.$('#email').val('');

                        // Focus email field
                        that.$('#email').focus();
                    }
                    else if (response.status == 'error') {
                        that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                    }
                    else {
                        app.router.navigate('accounts/password/reset/done/', { trigger: true });
                    }
                },
                alerts: that.alerts
            });
        }

    });

    Views.PasswordResetDone = Backbone.View.extend({
        template: "account/password_reset_done"
    });

    Views.Join = Backbone.View.extend({
        template: "account/join",

        tagName: 'div id="account-join-outer"',

        // Delegated events for creating new items.
        events: {
            'click #create-account': 'navigateToRegister'
        },

        navigateToRegister: function(e) {
            debug.info("Entering Views.Join.navigateToRegister()...");

            // Cancel default action of the keypress event.
            e.preventDefault();

            this.$el.addClass('animated fadeOutLeft');
            setTimeout(function() {
                app.router.navigate('accounts/register/', { trigger: true });
            }, 200);
        },

        serialize: function() {
            debug.info("Entering Views.Join.serialize()...");

            return { appname: app.name };
        }
    });

    Views.Register = Backbone.View.extend({
        template: "account/register",

        tagName: 'div id="account-register-outer" class="animated fadeInRight"',

        // Delegated events for creating new items.
        events: {
            'submit form#form-account-register': 'createAccountOnSubmit'
        },

        initialize: function(options) {
            debug.info("Entering Views.Register.initialize()...");

            this.session = options.session;
            this.alerts = options.alerts;
        },

        beforeRender: function() {
            debug.info("Entering Views.Register.beforeRender()...");
        },

        afterRender: function() {
            debug.info("Entering Views.PasswordReset.afterRender()...");

            this.$("#form-account-register").validate({
                highlight: function(element) {
                    $(element).parent('div').parent('div').addClass('error');
                },
                unhighlight: function(element) {
                    $(element).parent('div').parent('div').removeClass('error');
                },
                errorPlacement: function(error, element) {}
            });
        },

        createAccountOnSubmit: function(e) {
            debug.info("Entering Views.PasswordReset.createAccountOnSubmit()...");

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Construct array of all input elements that have a name
            // attribute. Ex. {name: "John Smith", age: 34}
            var arr = this.$('#form-account-register').serializeArray();
            var data = Utils.foldForm(arr);

            // Create reference to `this` to be used within callbacks.
            var that = this;

            this.model.save(data, {
                success: function(model, response, options){

                    if (response.status == 'fail') {
                        // Display alerts.
                        _.each(response.data, function(message) {
                            that.alerts.add(new Alert.Model({msg: message, level: 'error'}));
                        });

                        // Clear each form field.
                        _.each(arr, function(field) {
                            that.$('#' + field.name).val('');
                        });

                        // Focus username field
                        that.$('#username').focus();
                    }
                    else if (response.status == 'error') {
                        that.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                    }
                    else {
                        // The account model has been created.
                        // Now, create the session model.
                        that.session.save({email: that.model.get('email'), password: that.model.get('password')}, {
                            async: false,
                            success: function () {
                                debug.debug("Got session [" + JSON.stringify(that.session) + "]");
                                if (that.session.isAuthenticated()) {
                                    debug.debug("Authenticated! Navigating to profile view...");
                                    app.router.navigate('accounts/' + model.get('username') + '/', {trigger: true, replace: true});
                                }
                                else {
                                    debug.error("Something went wrong. Your account has been created. Please login.");
                                    that.alerts.add(new Alert.Model({msg: 'Your account has been created. Please login.', level: 'warn'}));
                                    app.router.navigate('sessions/login/', {trigger: true, replace: true});
                                }
                            }
                        });
                    }
                },
                alerts: that.alerts
            });
        },

        serialize: function() {
            debug.info("Entering Views.Register.serialize()...");

            var form = {
                id: 'form-account-register',
                classNames: ['inset'],
                fields : [
                    { label: 'Username', name: 'username', value: '', required: true, inputClassNames: ['first'] },
                    { label: 'Email', name: 'email', value: '', required: true, inputClassNames: ['middle'] },
                    { label: 'Password', name: 'password', type: 'password', value: '', required: true, inputClassNames: ['middle'] },
                    { label: 'Password again', name: 'password_again', type: 'password', value: '', required: true, inputClassNames: ['last'] }
                ],
                buttons : [
                    { classNames : [ 'btn', 'btn-success', 'btn-block' ], label : 'Create account' }
                ]
            };

            return { appname: app.name, form: form };
        }
    });

    Views.Settings = Backbone.View.extend({
        template: "account/settings",

        // Delegated events for creating new items.
        events: {
            'submit form#form-account-settings': 'updateLanguageOnSubmit'
        },

        initialize: function(options) {
            debug.info("Entering Views.Settings.initialize()...");
            this.alerts = options.alerts;
        },

        beforeRender: function() {
            debug.info("Entering Views.Settings.beforeRender()...");
        },

        serialize: function() {
            debug.info("Entering Views.Settings.serialize()...");

            var form = {
                id: 'form-account-settings',
                values: { language: localStorage.getItem('locale') },
                fields: [
                    { label: 'Language', name: 'language', type: 'select',
                        options: [
                            { id: 'en-us', name: 'English (US)' },
                            { id: 'fr-ca', name: 'Français (Canada)' }
                        ],
                        required: true
                    }
                ],
                buttons : [
                    { classNames : [ 'btn', 'btn-primary' ], label : 'Save Changes' },
                    { classNames : 'btn', label : 'Cancel', link : '/' }
                ],
                withLabel: true
            };

            return { form: form };
        },

        updateLanguageOnSubmit: function(e) {
            debug.info("Entering Views.Settings.updateLanguageOnSubmit()...");

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Construct array of all input elements that have a name
            // attribute. Ex. {name: "John Smith", age: 34}
            var arr = this.$('#form-account-settings').serializeArray();
            var data = Utils.foldForm(arr);

            // Update language.
            var locale = localStorage.getItem('locale');
            if(locale != data.language) {
                localStorage.setItem('locale', data.language);
                location.reload();
            }
        }
    });

    return Views;

});
