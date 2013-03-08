// Set the require.js configuration for your application.
require.config({

    // Initialize the application with the main application file.
    deps: ["main"],

    // Do a hard override of the locale here
    // The default is to auto-detect from browser defaults
    locale: localStorage.getItem('locale') || 'en-us',

    // Path mappings for module names not found directly under
    // baseUrl.
    paths: {
        // Libraries.
        jquery: 'vendor/jquery',
        'jquery.validate': 'vendor/jquery.validate',
        underscore: 'vendor/lodash.underscore',
        backbone: 'vendor/backbone/backbone',
        'backbone.layoutmanager': 'vendor/backbone.layoutmanager/backbone.layoutmanager',
        'backbone.localstorage': 'vendor/backbone/backbone-localstorage',
        'backbone.routefilter': 'vendor/backbone.routefilter',
        'backbone.subroute': 'vendor/backbone.subroute',
        "bootstrap": "vendor/bootstrap",
        'moment': 'vendor/moment',
        text: 'vendor/require/text',
        handlebars: 'vendor/handlebars/handlebars',
        helpers: 'vendor/handlebars/helpers',
        jed: "vendor/jed",
        i18n: "vendor/require/i18n",
        debug: 'vendor/ba-debug'
    },

    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        "backbone.layoutmanager": {
            deps: [
                "jquery",
                "backbone",
                "underscore"
            ],
            exports: "Backbone.LayoutManager"
        },
        "bootstrap": ["jquery"],
        "backbone.routefilter": {
            deps: [
                "backbone",
                "underscore"
            ],
            exports: "Backbone.Routefilter"
        },
        "backbone.subroute": {
            deps: ["backbone", "underscore"],
            exports: "Backbone.SubRoute"
        },
        "backbone.localstorage": ["backbone"],
        'helpers': {
            deps: [
                'handlebars'
            ],
            exports: 'Helpers'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'jquery.validate': {
            deps: [
                'jquery'
            ]
        },
        'jquery.cookie': {
            deps: [
                'jquery'
            ]
        },
        debug: {
            exports: "debug"
        }
    }
});