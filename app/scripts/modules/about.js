define([
    // Application.
    "app",

    // Modules.
    "modules/alert",
    "modules/session",
    "modules/account",
    "modules/header",
    "modules/meta",

    "modules/nls"
],

function(app, Alert, Session, Account, Header, Meta) {

    var About = app.module();

    // About Router
    // ------------

    About.Router = Backbone.SubRoute.extend({

        routes: {
            "us": "company", // #about/us/
            "faq": "faq", // #about/faq/
            "legal/terms": "terms", // #about/legal/terms/
            "legal/privacy": "privacy" // #about/legal/privacy/
        },

        initialize: function(options) {
            debug.info("Entering About.Router.initialize()...");

            this.session = options.session;
            this.account = options.account;
            this.alerts = options.alerts;
        },

        before: function( route ) {
            debug.info("Entering About.Router.before(" + route + ")...");
        },

        company: function() {
            debug.info("Entering About.Router.company()...");

            app.useLayout("twocolumn").setViews({
                "#container-nav": new Header.Views.Nav({
                    model: this.session,
                    alerts: this.alerts
                }),
                "#container-alert": new Alert.Views.List({
                    collection: this.alerts
                }),
                "#container-menu": new About.Views.Menu(),
                "#container-content": new About.Views.Company(),
                "#container-footer": new Meta.Views.Footer()
            }).render();
        },

        faq: function() {
            debug.info("Entering About.Router.faq()...");

            app.useLayout("twocolumn").setViews({
                "#container-nav": new Header.Views.Nav({
                    model: this.session,
                    alerts: this.alerts
                }),
                "#container-alert": new Alert.Views.List({
                    collection: this.alerts
                }),
                "#container-menu": new About.Views.Menu(),
                "#container-content": new About.Views.Faq(),
                "#container-footer": new Meta.Views.Footer()
            }).render();
        },

        terms: function() {
            debug.info("Entering About.Router.terms()...");

            app.useLayout("twocolumn").setViews({
                "#container-nav": new Header.Views.Nav({
                    model: this.session,
                    alerts: this.alerts
                }),
                "#container-alert": new Alert.Views.List({
                    collection: this.alerts
                }),
                "#container-menu": new About.Views.Menu(),
                "#container-content": new About.Views.Terms(),
                "#container-footer": new Meta.Views.Footer()
            }).render();
        },

        privacy: function() {
            debug.info("Entering About.Router.privacy()...");

            app.useLayout("twocolumn").setViews({
                "#container-nav": new Header.Views.Nav({
                    model: this.session,
                    alerts: this.alerts
                }),
                "#container-alert": new Alert.Views.List({
                    collection: this.alerts
                }),
                "#container-menu": new About.Views.Menu(),
                "#container-content": new About.Views.Privacy(),
                "#container-footer": new Meta.Views.Footer()
            }).render();
        }

    });

    // Links in about menu view.
    var menuItems = [
        { href: 'about/us', caption: 'Company' },
        { href: 'about/faq', caption: 'FAQ' },
        { href: 'about/legal/terms', caption: 'Terms' },
        { href: 'about/legal/privacy', caption: 'Privacy' }
    ];

    About.Views.Menu = Backbone.View.extend({
        template: 'about/menu',

        // Delegated events for creating new items.
        events: {
            //'click a':       'triggerMenuChange'
        },

        initialize: function() {
            debug.info("Entering About.Views.Menu.initialize()...");
        },

        beforeRender: function() {
            debug.info("Entering About.Views.Menu.beforeRender()...");
        },

        serialize: function() {
            debug.info("Entering About.Views.Menu.serialize()...");

            return {
                menuItems: menuItems,
                activePage: Backbone.history.fragment
            };
        }
    });

    About.Views.Company = Backbone.View.extend({
        template: "about/company",

        initialize: function() {
            debug.info("Entering About.Views.Company.initialize()...");
        }
    });

    About.Views.Faq = Backbone.View.extend({
        template: "about/faq",

        initialize: function() {
            debug.info("Entering About.Views.Faq.initialize()...");
        }
    });

    About.Views.Terms = Backbone.View.extend({
        template: "about/terms",

        initialize: function() {
            debug.info("Entering About.Views.Terms.initialize()...");
        }
    });

    About.Views.Privacy = Backbone.View.extend({
        template: "about/privacy",

        initialize: function() {
            debug.info("Entering About.Views.Privacy.initialize()...");
        }
    });

    // Required, return the module for AMD compliance.
    return About;

});
