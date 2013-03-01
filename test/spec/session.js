define([
    // Modules
    'modules/session',
    'modules/alert',
    'modules/header'
],
function(Session, Alert, Header) {

    describe('Session Module', function() {

        describe('Logging in', function() {

            var server;
            var requestCount = -1;

            before(function(done) {
                console.log("[TEST] Entering Session Module / Logging in before()...");

                // Instantiate layout.
                layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                var session = new Session.Model();
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var loginView = new Session.Views.Login({
                    model: session,
                    alerts: alerts
                });
                layout.insertView(alertView);
                layout.insertView(loginView);

                // Render views
                layout.render().then(function() {

                    // Create fake server to manipulate FakeXMLHttpRequest
                    // instances.
                    server = sinon.fakeServer.create();

                    // Attach the layout to this DOM.
                    $("#sandbox").empty().append(layout.el);

                    // `backbone.layoutmanager` renders views asynchronously.
                    // It must be done before any tests are run.
                    done();

                });

                //console.log($("body"));
            });

            after(function(done) {
                console.log("[TEST] Entering Session Module / Logging in after()...");

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            beforeEach(function(done) {
                console.log("[TEST] Entering Session Module / Logging in beforeEach()...");

                done();
            });

            afterEach(function(done) {
                console.log("[TEST] Entering Session Module / Logging in afterEach()...");

                done();
            });

            it('with invalid credentials should not send a request to the server.', function(done) {

                $('#email').val('demo@example.com');
                $('#password').val('');
                $('form#form-session-login').submit();

                var request = server.requests[requestCount];
                expect(request).to.be.undefined;

                done();
            });

            it('with valid credentials should send a POST request to the server.', function(done) {

                $('#email').val('demo@example.com');
                $('#password').val('default');
                $('form#form-session-login').submit();
                requestCount++;

                var request = server.requests[requestCount];
                var params = JSON.parse(request.requestBody);
                //console.log(request);
                //console.log(params);

                expect(request.method).to.equal('POST');
                expect(request.url).to.equal('http://localhost:5000/session/'); // TODO
                expect(params.email).to.equal('demo@example.com');
                expect(params.password).to.equal('default');

                done();
            });

            it('while authenticated should send a PUT request to the server.', function(done) {
                // TODO
                done();
            });

        });

        describe('Logging out', function() {

            var server;
            var requestCount = -1;

            before(function(done) {
                console.log("[TEST] Entering Session Module / Logging out before()...");

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                var session = new Session.Model({"id":8,"username":"test","auth":true});   // TODO
                var alerts = new Alert.Collection();
                var navView = new Header.Views.Nav({
                    model: session,
                    alerts: alerts
                });
                var alertView = new Alert.Views.List({collection: alerts});
                layout.insertView(navView);
                layout.insertView(alertView);

                // Render views
                layout.render().then(function() {

                    // Create fake server to manipulate FakeXMLHttpRequest
                    // instances.
                    server = sinon.fakeServer.create();

                    // Attach the layout to this DOM.
                    $("#sandbox").empty().append(layout.el);

                    // `backbone.layoutmanager` renders views asynchronously.
                    // It must be done before any tests are run.
                    done();

                });

                console.log($("body"));
            });

            after(function(done) {
                console.log("[TEST] Entering Session Module / Logging out after()...");

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            beforeEach(function(done) {
                console.log("[TEST] Entering Session Module / Logging out beforeEach()...");
                done();
            });

            afterEach(function(done) {
                console.log("[TEST] Entering Session Module / Logging out afterEach()...");
                done();
            });

            it('should send a DELETE request to the server.', function(done) {

                $('#logout').trigger('click');
                requestCount++;

                var request = server.requests[requestCount];
                expect(request.method).to.equal('DELETE');
                expect(request.url).to.equal('http://localhost:5000/session/');  // TODO

                done();
            });

        });

    });

});