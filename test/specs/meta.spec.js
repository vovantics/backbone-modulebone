/*global define:false, describe: false, before:false, after: false, it:false, expect: false */
define([
    // Libraries.
    'jquery',
    'underscore',
    'backbone',

    // Modules.
    'modules/meta',
    'modules/session',
    'modules/alert'
],
function($, _, Backbone, Meta, Session, Alert) {
    'use strict';

    describe('Meta Module', function() {

        describe('Contacting us', function() {

            var server;
            var requestCount = -1;

            before(function(done) {
                console.log('[TEST] Entering Meta Module / Contacting us before()...');

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                var mail = new Meta.Mail();
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var contactUsView = new Meta.Views.Contact({
                    model: mail,
                    alerts: alerts
                });
                layout.insertView(alertView);
                layout.insertView(contactUsView);

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
                console.log('[TEST] Entering Meta Module / Contacting us after()...');

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            it('with invalid info should not send a POST request to the server.', function(done) {

                $('#full_name').val('');
                $('#email').val('test@example.com');
                $('#subject').val('Test subject');
                $('#message').val('Test message');
                $('form#form-meta-contact').submit();

                var request = server.requests[requestCount];
                expect(request).to.be.undefined;

                done();
            });

            it('with valid info should send a POST request to the server.', function(done) {

                $('#full_name').val('Test User');
                $('#email').val('test@example.com');
                $('#subject').val('Test subject');
                $('#message').val('Test message');
                $('form#form-meta-contact').submit();
                requestCount++;

                var request = server.requests[requestCount];
                expect(request.method).to.equal('POST');
                expect(request.url).to.equal('http://localhost:5000/mail/'); // TODO

                done();
            });

        });

    });
});