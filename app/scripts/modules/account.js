define([
    // Application.
    "app",

    // Libs
    "backbone",

    // Views
    "modules/account/views",

    // Modules
    'modules/base',
    "modules/session",
    "modules/alert",
    'modules/header',
    'modules/meta'

    // Plugins
    //"vendor/backbone.subroute"
],

function(app, Backbone, Views, Base, Session, Alert, Header, Meta) {

    var Account = app.module();

    // Account Router
    // -----------

    Account.Router = Backbone.SubRoute.extend({

        routes: {
            "edit": "edit",             // #accounts/edit
            "register": "register",             // #accounts/register
            "settings": "settings",             // #accounts/settings
            "deactivate/request": "deactivate", // #accounts/deactivate/request
            'password/change': 'passwordChange',    // #accounts/password/change
            'password/reset': 'passwordReset',  // #accounts/password/reset
            'password/reset/done': 'passwordResetDone',    // #accounts/password/reset/done
            'password/reset/confirm/:email/:activation_key': 'passwordResetConfirm',    // #accounts/password/reset/confirm/<email>/<activation_key>
            'reactivate/:email/:activation_key': 'reactivate',    // #accounts/reactivate/<email>/<activation_key>
            ":username": "profile"      // #accounts/<username>
        },

        initialize: function(options) {
            debug.info("Entering Account.Router.initialize()...");

            this.session = options.session;
            this.account = options.account;
            this.language = options.language;
            this.alerts = options.alerts;
        },

        before: function( route ) {
            debug.info("Entering Account.Router.before(" + route + ")...");
        },

        profile: function(username) {
            app.router.loginRequired(function() {
                debug.info("Entering Account.Router.profile(" + username + ")...");

                // Set layout and views, then render.
                app.useLayout("onecolumn").setViews({
                    "#container-nav": new Header.Views.Nav({
                        model: this.session,
                        alerts: this.alerts
                    }),
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-content": new Account.Views.Profile({
                        model: this.account
                    }),
                    "#container-footer": new Meta.Views.Footer()
                }).render();
            });
        },

        deactivate: function() {
            app.router.loginRequired(function() {
                debug.info("Entering Account.Router.edit()...");

                // Set layout and views, then render.
                app.useLayout("twocolumn").setViews({
                    "#container-nav": new Header.Views.Nav({
                        model: this.session,
                        alerts: this.alerts
                    }),
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-menu": new Account.Views.Menu(),
                    "#container-content": new Account.Views.Deactivate({
                        model: this.account,
                        session: this.session,
                        alerts: this.alerts
                    }),
                    "#container-footer": new Meta.Views.Footer()
                }).render();
            });
        },

        edit: function() {
            app.router.loginRequired(function() {
                debug.info("Entering Account.Router.edit()...");

                // Set layout and views, then render.
                app.useLayout("twocolumn").setViews({
                    "#container-nav": new Header.Views.Nav({
                        model: this.session,
                        alerts: this.alerts
                    }),
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-menu": new Account.Views.Menu(),
                    "#container-content": new Account.Views.Edit({
                        model: this.account,
                        alerts: this.alerts
                    }),
                    "#container-footer": new Meta.Views.Footer()
                }).render();
            });
        },

        register: function() {
            app.router.anonymousRequired(function() {
                debug.info("Entering Account.Router.register()...");

                // Set layout and views, then render.
                app.useLayout("splash").setViews({
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-content": new Account.Views.Register({
                        model: this.account,
                        session: this.session,
                        alerts: this.alerts
                    })
                }).render();
            });
        },

        passwordChange: function() {
            app.router.loginRequired(function() {
                debug.info("Entering Account.Router.passwordChange()...");

                // Set layout and views, then render.
                app.useLayout("twocolumn").setViews({
                    "#container-nav": new Header.Views.Nav({
                        model: this.session,
                        alerts: this.alerts
                    }),
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-menu": new Account.Views.Menu(),
                    "#container-content": new Account.Views.PasswordChange({
                        model: this.account,
                        alerts: this.alerts
                    }),
                    "#container-footer": new Meta.Views.Footer()
                }).render();
            });
        },

        passwordReset: function() {
            app.router.anonymousRequired(function() {
                debug.info("Entering Account.Router.passwordReset()...");

                // The passwordActivationKey model is used to initiate
                // a password reset.
                var passwordActivationKey = new Account.PasswordActivationKey();

                // Set layout and views, then render.
                app.useLayout("onecolumn").setViews({
                    "#container-nav": new Header.Views.Nav({
                        model: this.session,
                        alerts: this.alerts
                    }),
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-content": new Account.Views.PasswordReset({
                        model: passwordActivationKey,
                        alerts: this.alerts
                    }),
                    "#container-footer": new Meta.Views.Footer()
                }).render();
            });
        },

        passwordResetDone: function() {
            app.router.anonymousRequired(function() {
                debug.info("Entering Account.Router.passwordResetDone()...");

                // Set layout and views, then render.
                app.useLayout("onecolumn").setViews({
                    "#container-nav": new Header.Views.Nav({
                        model: this.session,
                        alerts: this.alerts
                    }),
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-content": new Account.Views.PasswordResetDone(),
                    "#container-footer": new Meta.Views.Footer()
                }).render();
            });
        },

        passwordResetConfirm: function(email, activation_key) {
            debug.info("Entering Account.Router.passwordResetConfirm()...");

            // Fetch the account model, given the email & activation key.
            this.account.clear();
            this.account.set( { email: email, activation_key : activation_key } );
            var that = this;
            this.account.fetch({
                async: false,
                success: function (model, response, options) {
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
                        debug.debug("Got the account to password reset, given email=[" + email + "] activation_key=[" + activation_key + "]!");
                    }
                },
                alerts: that.alerts
            });

            // Set layout and views, then render.
            var layout = app.useLayout("onecolumn");
            layout.setViews({
                "#container-nav": new Header.Views.Nav({
                    model: this.session,
                    alerts: this.alerts
                }),
                "#container-alert": new Alert.Views.List({
                    collection: this.alerts
                }),
                "#container-footer": new Meta.Views.Footer()
            });
            // Only display password change view if account exists.
            if (this.account.id) {
                layout.setViews({
                    "#container-content": new Account.Views.PasswordChange({
                        model: this.account,
                        alerts: this.alerts
                    })
                });
            }
            layout.render();
        },

        reactivate: function(email, activation_key) {
            debug.info("Entering Account.Router.reactivate()...");

            // Fetch the account model, given the email & activation key.
            this.account.set( { email: email, activation_key : activation_key } );
            var that = this;
            this.account.fetch({
                async: false,
                success: function (model, response, options) {
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
                        debug.debug("Got the account to activate, given email=[" + email + "] activation_key=[" + activation_key + "]!");
                    }
                },
                alerts: that.alerts
            });

            // Update the account's status.
            if (this.account.id) {
                // Create reference to `this` to be used within callbacks.
                var thy = this;

                this.account.save({ status: 'active' },
                {
                    success: function(model, response, options){
                        if (response.status == 'fail') {
                            // Display alerts.
                            _.each(response.data, function(message) {
                                thy.alerts.add(new Alert.Model({msg: message, level: 'error'}));
                            });
                        }
                        else if (response.status == 'error') {
                            thy.alerts.add(new Alert.Model({msg: response.data.message, level: 'error'}));
                        }
                        else {
                            that.alerts.add(new Alert.Model({msg: 'Your account has been reactivated! Please log in to continue.', level: 'success'}));
                            app.router.navigate('sessions/login/', {trigger: true, replace: true});
                        }
                    },
                    alerts: thy.alerts
                });
            }
        },

        settings: function() {
            app.router.loginRequired(function() {
                debug.info("Entering Account.Router.settings()...");

                // Set layout and views, then render.
                app.useLayout("twocolumn").setViews({
                    "#container-nav": new Header.Views.Nav({
                        model: this.session,
                        alerts: this.alerts
                    }),
                    "#container-alert": new Alert.Views.List({
                        collection: this.alerts
                    }),
                    "#container-menu": new Account.Views.Menu(),
                    "#container-content": new Account.Views.Settings({
                        model: this.account,
                        alerts: this.alerts,
                        language: this.language
                    }),
                    "#container-footer": new Meta.Views.Footer()
                }).render();
            });
        }

    });

    // Account PasswordActivationKey Model
    // -----------------------------------

    Account.PasswordActivationKey = Base.Model.extend({

        urlRoot: 'http://' + app.serverHost + '/users/password/reset/',

        initialize: function() {
            debug.info("Entering Account.PasswordActivationKey.initialize()...");
        }

    });


    // Account Model
    // -------------

    Account.Model = Base.Model.extend({

        urlRoot: 'http://' + app.serverHost + '/users/',

        initialize: function() {
            debug.info("Entering Account.Model.initialize()...");

            Base.Model.prototype.initialize.call(this);
        },

        // The callback function that is called when this model's data
        // is returned by the server, in fetch, and save. Returns the
        // attributes hash to be set on the model
        parse: function(response) {
            debug.info("Entering Account.Model.parse()...");

            if (response.status == 'success') {
                debug.debug("Account model response success [" + JSON.stringify(response) + "]");
                return response.data;
            }
            else {
                debug.debug("Account model response error/fail [" + JSON.stringify(response) + "]");
                return false;
            }
        },

        // Use id or (email and activation_key) to get/update an
        // account.
        sync: function (method, model, options) {
            debug.info("Entering Account.Model.sync()...");

            options || (options = {});

            // Passing options.url will override the default
            // construction of the url in Backbone.sync
            if (method == "read") {
                if (model.get("email") && model.get("activation_key")) {
                    options.url = model.urlRoot + model.get("email") + '/' + model.get("activation_key") + '/';
                }
                else {
                    options.url = model.urlRoot + model.get("id") + '/';
                }
            }
            else if (method == "update") {
                if (model.get("email") && model.get("activation_key") && model.get("password")) {
                    options.url = model.urlRoot + 'password/' + model.get("email") + '/' + model.get("activation_key") + '/';
                }
                else if (model.get("email") && model.get("activation_key") && model.get("status")) {
                    options.url = model.urlRoot + 'activate/' + model.get("email") + '/' + model.get("activation_key") + '/';
                }
                else {
                    options.url = model.urlRoot + model.get("id") + '/';
                }
            }

            return Backbone.sync(method, model, options);
        }
    });

    // Account Collection
    // ---------------

    Account.List = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Account.Model

    });

    // Account Views
    // ----------

    // Attach the Views sub-module into this module.
    Account.Views = Views;

    // Required, return the module for AMD compliance.
    return Account;

});
