/*jshint scripturl: true */
require.config({

    // Do a hard override of the locale here
    // The default is to auto-detect from browser defaults
    //locale: localStorage.getItem('locale') || 'en-us',
    locale: 'en-us',

    // Path mappings for module names not found directly under
    // baseUrl.
    paths: {
        // Libraries.
        jquery: 'vendor/jquery',
        //jquery: '../bower_components/jquery/jquery',
        'jquery.validate': '../bower_components/jquery.validation/jquery.validate',
        underscore: '../bower_components/lodash/dist/lodash.underscore',
        backbone: '../bower_components/backbone/backbone',
        'backbone.layoutmanager': '../bower_components/layoutmanager/backbone.layoutmanager',
        'backbone.localstorage': '../bower_components/backbone/examples/backbone.localStorage',
        'backbone.routefilter': '../bower_components/backbone.routefilter/dist/backbone.routefilter',
        'backbone.subroute': '../bower_components/backbone.subroute/backbone.subroute',
        'bootstrap': 'vendor/bootstrap',
        'moment': '../bower_components/moment/moment',
        text: '../bower_components/requirejs-text/text',
        handlebars: '../bower_components/handlebars/handlebars',
        helpers: '../bower_components/handlebars-helpers/helpers',
        jed: '../bower_components/jed/jed',
        i18n: '../bower_components/requirejs-i18n/i18n',
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
        'backbone.layoutmanager': {
            deps: [
                'jquery',
                'backbone',
                'underscore'
            ],
            exports: 'Backbone.LayoutManager'
        },
        'bootstrap': ['jquery'],
        'backbone.routefilter': {
            deps: [
                'backbone',
                'underscore'
            ],
            exports: 'Backbone.Routefilter'
        },
        'backbone.subroute': {
            deps: ['backbone', 'underscore'],
            exports: 'Backbone.SubRoute'
        },
        'backbone.localstorage': ['backbone'],
        'handlebars': {
            exports: 'Handlebars'
        },
        'helpers': {
            deps: [
                'handlebars'
            ],
            exports: 'Helpers'
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
            exports: 'debug'
        }
    }
});

require([
    // Application.
    'app',

    // Main Router.
    'router',

    // Libraries
    'jquery',
    'underscore',
    'backbone',
    'debug'
],
function(app, Router, $, _, Backbone, debug) {
    'use strict';

    // Set a minimum or maximum logging level for the console.
    // log (1) < debug (2) < info (3) < warn (4) < error (5)
    debug.setLevel(5);

    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support, set the
    // root folder to '/' by default.  Change in app.js.
    // TODO: http://stackoverflow.com/questions/13893746/backbone-routes-break-on-refresh-with-yeoman
    // https://github.com/yeoman/yeoman/issues/468
    // https://github.com/yeoman/yeoman/pull/805
    debug.info('Starting Backbone history...');
    Backbone.history.start({ pushState: true, root: app.root });
    //Backbone.history.start({ root: app.root });
    //Backbone.history.start({ pushState: false });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router. If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on('click', 'a:not([data-bypass])', function(evt) {
        // Get the anchor href and protcol
        var href = $(this).attr('href');
        //var protocol = this.protocol + '//';

        // Ensure the protocol is not part of URL, meaning its relative.
        //if (href && href.slice(0, protocol.length) !== protocol &&
        //    href.indexOf('javascript:') !== 0) {

        // If the href exists and is a hash route, run it through Backbone.
        if (href && href.indexOf('#') === 0) {
            // Stop the default event to ensure the link will not cause a page
            // refresh.
            evt.preventDefault();

            // `Backbone.history.navigate` is sufficient for all Routers and will
            // trigger the correct events. The Router's internal `navigate` method
            // calls this anyways.
            Backbone.history.navigate(href, true);
        }
    });
});
