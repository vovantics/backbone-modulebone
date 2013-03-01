define([
    // Application.
    "app",

    // Libs
    "backbone",

    // Modules.
    "modules/session",
    "modules/alert",
    'modules/header',
    'modules/meta'
],

function(app, Backbone, Session, Alert, Header, Meta) {

    var Thing = app.module();

    // Thing Router
    // -----------

    Thing.Router = Backbone.SubRoute.extend({

        routes: {
            "list": "list"             // #accounts/list
        },

        initialize: function(options) {
            debug.info("Entering Thing.Router.initialize()...");

            this.session = options.session;
            this.account = options.account;
            this.alerts = options.alerts;
        },

        before: function( route ) {
            debug.info("Entering Thing.Router.before(" + route + ")...");
        },

        list: function() {
            debug.info("Entering Thing.Router.profile()...");

            // Set layout and views, then render.
            app.useLayout("onecolumn").setViews({
                "#container-nav": new Header.Views.Nav({
                    model: this.session,
                    alerts: this.alerts
                }),
                "#container-alert": new Alert.Views.List({
                    collection: this.alerts
                }),
                "#container-content": new Thing.Views.List(),
                "#container-footer": new Meta.Views.Footer()
            }).render();
        }
    });

    Thing.Views.List = Backbone.View.extend({
        template: "thing/list",

        initialize: function() {
            debug.info("Entering Thing.Views.List.initialize()...");
        }
    });

  // Required, return the module for AMD compliance.
  return Thing;

});
