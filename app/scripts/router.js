define([
    // Application.
    "app",

    // Libraries
    "backbone",

    // Modules.
    "modules/session",
    "modules/todo",
    "modules/account",
    "modules/meta",
    "modules/alert",
    "modules/header",
    "modules/thing",
    "modules/about",

    // Plugins
    "backbone.routefilter"
],

function(app, Backbone, Session, Todo, Account, Meta, Alert, Header, Thing, About) {

    // Defining the main router, you can attach sub routers here.
    var Router = Backbone.Router.extend({

        routes: {
            'todos/*subroute': 'todo',
            'sessions/*subroute': 'session',
            'accounts/*subroute': 'account',
            'thing/*subroute': 'thing',
            'about/*subroute': 'about',
            "": "home",
            "landing": "landing",
            "contact": "contact"
        },

        initialize: function() {
            debug.info("Entering Router.initialize()...");

            // The session model is used to determine if the user is
            // authenticated or not.
            this.session = new Session.Model();

            // The account model is populated with user data if the
            // user is authenticated.
            this.account = new Account.Model();

            // Create a new Alert Collection.
            this.alerts = new Alert.Collection();
            this.alerts.add(new Alert.Model({msg: 'This is how we style it.', level: 'error'}));  // TODO
        },

        subRoutes: {},

        // All models needed at load time should be bootstrapped in to
        // place here. This `backbone.routefilter` filter is called
        // before every main router action and gets the session and
        // account if user is authenticated.
        before: function(route) {
            debug.info("Entering Router.before(" + route + ")...");

            // Fetch the session and account from the server.
            var that = this;
            this.session.fetch({
                async: false,
                success: function () {
                    debug.debug("Got session [" + JSON.stringify(that.session) + "]");
                    if (that.session.isAuthenticated()) {
                        that.account.set( { id: that.session.id } );
                        debug.debug("Authenticated! Fetching the account for id=[" + that.account.id + "]");
                        that.account.fetch({async: false, alerts: that.alerts});
                        debug.debug("Got account [" + JSON.stringify(that.account) + "]");
                    }
                    else {
                        debug.debug("Not authenticated! Don't get the account.");
                    }
                },
                alerts: that.alerts
            });
        },

        anonymousRequired: function(ifYes) {
            debug.info("Entering Router.anonymousRequired()...");
            if (!this.session.isAuthenticated()) {
                if ($.isFunction(ifYes)) ifYes.call(this);
            }
            else {
                app.router.navigate('', { trigger: true });
            }
        },

        loginRequired: function(ifYes) {
            debug.info("Entering Router.loginRequired()...");
            if (this.session.isAuthenticated()) {
                if ($.isFunction(ifYes)) ifYes.call(this);
            }
            else {
                app.router.navigate('sessions/login?next=' + encodeURIComponent(location.hash), { trigger: true });
            }
        },

        todo: function(subroute) {
            debug.info("Entering Router.todo(" + subroute + ")...");
            if (!this.subRoutes.todo) {
                // Instantiate todo module specific routes.
                this.subRoutes.todo = new Todo.Router("todos", {createTrailingSlashRoutes: true, trigger: true});
            }
        },

        session: function(subroute) {
            debug.info("Entering Router.session(" + subroute + ")...");
            if (!this.subRoutes.session) {
                // Instantiate session module specific routes.
                this.subRoutes.session = new Session.Router("sessions", {session: this.session, alerts: this.alerts, createTrailingSlashRoutes: true, trigger: true});
            }
        },

        account: function(subroute) {
            debug.info("Entering Router.account(" + subroute + ")...");
            if (!this.subRoutes.account) {
                // Instantiate account module specific routes.
                this.subRoutes.account = new Account.Router("accounts", {session: this.session, account: this.account, alerts: this.alerts, createTrailingSlashRoutes: true, trigger: true});
            }
        },

        thing: function(subroute) {
            debug.info("Entering Router.thing(" + subroute + ")...");
            if (!this.subRoutes.thing) {
                // Instantiate thing module specific routes.
                this.subRoutes.thing = new Thing.Router("thing", {session: this.session, account: this.account, alerts: this.alerts, createTrailingSlashRoutes: true, trigger: true});
            }
        },

        about: function(subroute) {
            debug.info("Entering Router.about(" + subroute + ")...");
            if (!this.subRoutes.about) {
                // Instantiate thing module specific routes.
                this.subRoutes.about = new About.Router("about", {session: this.session, account: this.account, alerts: this.alerts, createTrailingSlashRoutes: true, trigger: true});
            }
        },

        home: function() {
            debug.info("Entering Router.home()...");

            //this.landing(); // TODO: Change me.
            if (!this.subRoutes.thing) {
                // Instantiate thing module specific routes.
                this.subRoutes.thing = new Thing.Router("thing", {session: this.session, account: this.account, alerts: this.alerts, createTrailingSlashRoutes: true, trigger: true});
            }
            this.subRoutes.thing.list();
        },

        landing: function() {
            debug.info("Entering Router.landing()...");

            app.useLayout("splash").setViews({
                "#container-content": new Meta.Views.Landing(),
                "#container-footer": new Meta.Views.Footer()
            }).render();
        },

        contact: function() {
            debug.info("Entering Router.contact()...");

            var mail = new Meta.Mail();
            app.useLayout("layouts/onecolumn").setViews({
                "#container-nav": new Header.Views.Nav({
                    model: this.session,
                    alerts: this.alerts
                }),
                "#container-alert": new Alert.Views.List({
                    collection: this.alerts
                }),
                "#container-content": new Meta.Views.Contact({
                    model: mail,
                    alerts: this.alerts
                }),
                "#container-footer": new Meta.Views.Footer()
            }).render();
        }

    });

    // Required, return the module for AMD compliance.
    return Router;

});
