/*global define:false, describe: false, before:false, after: false, it:false */
define([
    // Libraries.
    'jquery',
    'underscore',
    'backbone',

    // Modules.
    'modules/about',
    'modules/session',
    'modules/alert'
],
function($, _, Backbone, About, Session, Alert) {
    'use strict';

    describe('About Module', function() {

        describe('Viewing the terms', function() {

            var server;
            var requestCount = -1;

            before(function(done) {
                console.log('[TEST] Entering About Module / Viewing the terms before()...');

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var termsView = new About.Views.Terms();
                layout.insertView(alertView);
                layout.insertView(termsView);

                // Render views
                layout.render().then(function() {

                    // Create fake server to manipulate FakeXMLHttpRequest
                    // instances.
                    server = sinon.fakeServer.create();

                    // Attach the layout to this DOM.
                    $('#sandbox').empty().append(layout.el);

                    // `backbone.layoutmanager` renders views asynchronously.
                    // It must be done before any tests are run.
                    done();

                });
            });

            after(function(done) {
                console.log('[TEST] Entering About Module / Viewing the terms after()...');

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            it('should contain text.', function(done) {
                // TODO
                done();
            });

        });

    });
});