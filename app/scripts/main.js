require([
    // Application.
    "app",

    // Main Router.
    "router",

    // Libraries
    'debug'
],

function(app, Router) {

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
    debug.info("Starting Backbone history...");
    //Backbone.history.start({ pushState: true, root: app.root });
    //Backbone.history.start({ root: app.root });
    Backbone.history.start({ pushState: false });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router. If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function(evt) {
        // Get the anchor href and protcol
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";

        // Ensure the protocol is not part of URL, meaning its relative.
        if (href && href.slice(0, protocol.length) !== protocol &&
            href.indexOf("javascript:") !== 0) {
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
