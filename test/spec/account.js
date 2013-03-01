define([
    // Modules
    'modules/session',
    'modules/alert',
    'modules/account'
],
function(Session, Alert, Account) {

    describe('Account Module', function() {

        describe('Signing up', function() {

            var server;
            var requestCount = -1;

            before(function(done) {
                console.log("[TEST] Entering Account Module / Signing up before()...");

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                var account = new Account.Model();
                var session = new Session.Model();
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var registerView = new Account.Views.Register({
                    model: account,
                    session: session,
                    alerts: alerts
                });
                layout.insertView(alertView);
                layout.insertView(registerView);

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
            });

            after(function(done) {
                console.log("[TEST] Entering Account Module / Signing up after()...");

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            it('with invalid info should not send a POST request to the server.', function(done) {

                $('#username').val('test');
                $('#email').val('test@example.com');
                $('#password').val('default');
                $('#password_again').val('');
                $('form#form-account-register').submit();

                var request = server.requests[requestCount];
                expect(request).to.be.undefined;

                done();
            });

            it('with valid info should send a POST request to the server.', function(done) {

                $('#username').val('test');
                $('#email').val('test@example.com');
                $('#password').val('default');
                $('#password_again').val('default');
                $('form#form-account-register').submit();
                requestCount++;

                var request = server.requests[requestCount];
                expect(request.method).to.equal('POST');
                expect(request.url).to.equal('http://localhost:5000/users/'); // TODO

                done();
            });

        });

        describe('Updating an account', function() {

            var account;
            var accountId = 8;
            var server;
            var requestCount = -1;

            before(function(done) {
                console.log("[TEST] Entering Account Module / Updating an account before()...");

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                account = new Account.Model({"id":accountId,"email":"test@example.com","username":"test","first_name":"Test","last_name":"Dude","phone":"1234567890","url":"http://www.example.com/test","bio":"Test dude is the crash test dummy.","created_time":"2013-02-20 08:11:11","gender":"male","dob":"1985-01-17"});
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var editView = new Account.Views.Edit({
                    model: account,
                    alerts: alerts
                });
                layout.insertView(alertView);
                layout.insertView(editView);

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
            });

            after(function(done) {
                console.log("[TEST] Entering Account Module / Updating an account after()...");

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            it('should first display the account data in the form fields.', function(done) {
                // Verify form fields are populated with data.
                // Account attributes ex. {"id":8,"email":"test@example.com","username":"test","first_name":"Test","last_name":"Dude","phone":"1234567890","url":"http://www.example.com/test","bio":"Test dude is the crash test dummy.","created_time":"2013-02-20 08:11:11","age":29}
                _.each(account.attributes, function(value, key) {
                    if (!_.contains(['id', 'created_time'], key)) {
                        // Form field values are always stored as
                        // strings.
                        if (key === 'dob') {
                            var isoDateArray = value.toString().split('-');
                            var yearSelected = isoDateArray[0];
                            var monthSelected = isoDateArray[1];
                            var daySelected = isoDateArray[2];
                            expect($('#dob-year').val()).to.equal(yearSelected);
                            expect($('#dob-month').val()).to.equal(monthSelected);
                            expect($('#dob-day').val()).to.equal(daySelected);
                        }
                        else {
                            expect($('#' + key).val()).to.equal(value.toString());
                        }
                    }
                });

                done();
            });

            it('should send a PUT request to the server.', function(done) {

                _.each(account.attributes, function(value, key) {
                    if (!_.contains(['id', 'created_time', 'dob'], key)) {
                        if (key === 'gender') {
                            $('#' + key).val('male');
                            $('form#form-account-edit').submit();
                            requestCount++;

                            var request = server.requests[requestCount];
                            var params = JSON.parse(request.requestBody);
                            expect(request.method).to.equal('PUT');
                            expect(request.url).to.equal('http://localhost:5000/users/' + accountId + '/'); // TODO
                            expect(params[key]).to.equal('male');
                        }
                        else {
                            $('#' + key).val('randomtext');
                            $('form#form-account-edit').submit();
                            requestCount++;

                            var request = server.requests[requestCount];
                            var params = JSON.parse(request.requestBody);
                            expect(request.method).to.equal('PUT');
                            expect(request.url).to.equal('http://localhost:5000/users/' + accountId + '/'); // TODO
                            expect(params[key]).to.equal('randomtext');
                        }
                    }
                });

                done();
            });

        });

        describe('Deactivating an account', function() {

            var accountId = 8;
            var server;
            var requestCount = -1;

            before(function(done) {
                console.log("[TEST] Entering Account Module / Deactivating an account before()...");

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                account = new Account.Model({"id":accountId,"email":"test@example.com","username":"test","first_name":"Test","last_name":"Dude","phone":"1234567890","url":"http://www.example.com/test","bio":"Test dude is the crash test dummy.","created_time":"2013-02-20 08:11:11","gender":"male","dob":"1985-01-17"});
                var session = new Session.Model({"id":8,"username":"test","auth":true});   // TODO
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var deactivateView = new Account.Views.Deactivate({
                    model: account,
                    session: session,
                    alerts: alerts
                });
                layout.insertView(alertView);
                layout.insertView(deactivateView);

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
            });

            after(function(done) {
                console.log("[TEST] Entering Account Module / Deactivating an account after()...");

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            it('should send a DELETE request to the server.', function(done) {
                $('form#form-account-deactivate').submit();
                requestCount++;

                var request = server.requests[requestCount];
                expect(request.method).to.equal('DELETE');
                expect(request.url).to.equal('http://localhost:5000/users/' + accountId + '/'); // TODO

                done();
            });

        });

        describe('Changing a password', function() {

            var account;
            var accountId = 8;
            var server;
            var requestCount = -1;

            before(function(done) {
                console.log("[TEST] Entering Account Module / Changing a password before()...");

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                account = new Account.Model({"id":accountId,"email":"test@example.com","username":"test","first_name":"Test","last_name":"Dude","phone":"1234567890","url":"http://www.example.com/test","bio":"Test dude is the crash test dummy.","created_time":"2013-02-20 08:11:11","gender":"male","dob":"1985-01-17"});
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var passwordChangeView = new Account.Views.PasswordChange({
                    model: account,
                    alerts: alerts
                });
                layout.insertView(alertView);
                layout.insertView(passwordChangeView);

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
            });

            after(function(done) {
                console.log("[TEST] Entering Account Module / Changing a password after()...");

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            it('with non-matching passwords should not send a PUT request to the server.', function(done) {
                $('#password').val('test');
                $('#password_again').val('yest');
                $('form#form-account-changepassword').submit();

                var request = server.requests[requestCount];
                expect(request).to.be.undefined;

                done();
            });

            it('with matching passwords should send a PUT request to the server.', function(done) {
                $('#password').val('test');
                $('#password_again').val('test');
                $('form#form-account-changepassword').submit();
                requestCount++;

                var request = server.requests[requestCount];
                console.log(request);
                expect(request.method).to.equal('PUT'); // TODO: Should be a PARTIAL request
                expect(request.url).to.equal('http://localhost:5000/users/' + accountId + '/'); // TODO

                done();
            });

        });

        describe('Initiating a password recovery', function() {

            var server;
            var requestCount = -1;

            before(function(done) {
                console.log("[TEST] Entering Account Module / Initiating a password recovery before()...");

                // Instantiate layout.
                var layout = new Backbone.Layout();

                // Instantiate views and insert them into layout.
                var passwordActivationKey = new Account.PasswordActivationKey();
                var alerts = new Alert.Collection();
                var alertView = new Alert.Views.List({collection: alerts});
                var passwordResetView = new Account.Views.PasswordReset({
                    model: passwordActivationKey,
                    alerts: alerts
                });
                layout.insertView(alertView);
                layout.insertView(passwordResetView);

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
            });

            after(function(done) {
                console.log("[TEST] Entering Account Module / Initiating a password recovery after()...");

                // Restores the native fake server XHR constructor.
                server.restore();

                done();
            });

            /*TODO it('while logged in should not send a request to the server.', function(done) {
                done();
            });*/

            it('while not logged in should send a POST request to the server.', function(done) {
                $('#email').val('test@example.com');
                $('form#form-account-resetpassword').submit();
                requestCount++;

                var request = server.requests[requestCount];
                var params = JSON.parse(request.requestBody);
                expect(request.method).to.equal('POST');
                expect(request.url).to.equal('http://localhost:5000/users/password/reset/'); // TODO

                done();
            });

        });

    });
});