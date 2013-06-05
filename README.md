# backbone-modulebone

backbone-modulebone is a frontend heavy single-page HTML5 boilerplate app with a Todo app, alerts, authentication, authorization, registration, profile edit, and password reset/change.

"We search for some kind of harmony between two intangibles: a form we have not yet designed and a context we cannot properly describe" -Christopher Alexander, the father of design patterns.

The app is designed using the JavaScript module pattern. It’s composed of a set of highly decoupled, distinct pieces of functionality stored in modules. Loose coupling facilitates easier maintainability by removing dependencies where possible. When this is implemented efficiently, it's quite easy to see how changes to one part of a system may affect another.

Everything each module needs to work should be confined into either the module or plugins that are shared among modules. In this regard, the fact that most modules depend on the Session module model and Alert module collection leaves much to be desired, so feedback is welcome.

## Project Structure

Code is divided into [modules](http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules/) that live under their own modules directory. A module has dependencies from the common libraries in the application and also has specific code for the packages execution alone; other packages should not require another packages dependencies.

    app                      → Application sources
     └ components            → Bower packages
     └ img                   → Images
     └ scripts               → JavaScripts
        └ modules            → Modules
           └ account         → Account module views
           └ nls             → National Language Support module views
           └ session         → Session module views
           └ todo            → Todo module views, constants
           about.js          → About module router, views
           account.js        → Account module router, models, collection
           base.js           → Base module models
           header.js         → Header module views
           macros.js         → Macros module
           meta.js           → Meta module router, views
           nls.js            → National Language Support module
           session.js        → Session module router, model
           thing.js          → Thing module
           todos.js          → Todo module router, model, collection
           utils.js          → Utils module
        └ vendor             → Vendor JavaScripts
        app.js               → App
        config.js            → Require.js configuration
        main.js              → App entry
        router.js            → Main router
     └ styles                → Stylesheets
     └ templates             → Templates
      .buildignore           → Used for building
      .htaccess              → Web server config
      404.html               → ??? TODO
      favicon.ico            → Favicon
      index.html             → The single page that is loaded
      robots.txt             → Instructions to robots
    components               → Bower packages
    test                     → Test scripts
     .gitignore              → Untracked files that git should ignore
     Gruntfile.js            → Workflow tasks
     LICENSE                 → License
     README.md               → Used for Readme Driven Development
     package.json            → npm package list

## [Backbone.js](http://backbonejs.org/)

The Backbone.js solves the JavaScript spaghetti problem by providing a MV framework that includes useful constructs such as Event, Router, Model, Collection, and View. It's dependent on Underscore.js (or Lo-Dash). Underscore provides a toolbelt of functional programming support for manipulating common JS data structures.

Continuing with the module pattern, each module can define its own module-specific routes. This is accomplished using the [Backbone.subroute](https://github.com/ModelN/backbone.subroute) plugin. Authenticated views require a session before the route is triggered. The [Backbone.routefilter](https://github.com/boazsender/backbone.routefilter) plugin provides before and after filters.

The [Backbone.layoutmanager](http://github.com/tbranyen/backbone.layoutmanager) plugin formalizes from start to finish the fetching of layouts and templates, the rendering in any engine, and assembling into the DOM.

The Todo module persists todos to local storage using the [Backbone.localStorage](https://github.com/jeromegn/Backbone.localStorage) adapter. The account module also persists the locale to local storage.

## [jQuery](http://jquery.com/)

jQuery is used for DOM manipulation, animation, and AJAX. The [Animate.less](https://github.com/machito/animate.less) stylesheet is also included to provide a Cross-browser CSS3 animation library.

## [Require.js](http://requirejs.org/)

Maintaining the order of JavaScript includes is a waste of life. Require.js is used for AMD script async loading and file dependency management. The [RequireJS text](http://requirejs.org/docs/api.html#text) plugin assists with external template management. [r.js](http://requirejs.org/docs/optimization.html) is used for script optimization.

## [Handlebars.js](http://handlebarsjs.com/)

The goals here are to keep templates logic-less and in external files so that they're designer+developer team ready. [Handlebars.js](http://handlebarsjs.com/) provides logic-less templating. The [Backbone.layoutmanager](http://github.com/tbranyen/backbone.layoutmanager) plugin handles any fetching of templates.

Forms are validated using [jQuery Validation](http://docs.jquery.com/Plugins/Validation) and kept DRY using Handlebars helpers. [Jed](http://slexaxton.github.com/Jed/) adds i18n support in gettext style. i18n bundles are defined using the [RequireJS i18n](http://requirejs.org/docs/api.html#i18n) plugin. [Moment.js](http://momentjs.com/) library provides functions for formatting dates.

## [Twitter Bootstrap](http://twitter.github.com/bootstrap/)

Responsive templates are styled using Twitter Bootstrap and its JavaScript plugins.Source stylesheet categorization, naming convention, and formatting follows [SMACSS](http://smacss.com/).

## Logging

[javascript-debug](https://github.com/cowboy/javascript-debug) provides Console logging with a configurable log level.

## Testing

[Mocha.js](http://visionmedia.github.com/mocha/) is the front end unit testing framework. It allows you to use any assertion library you want. I used [Chai.js](http://chaijs.com/). The [Sinon.js](http://sinonjs.org/) library is used for test spies, stubs and mocks.

## Workflows

[Yeoman](http://yeoman.io/) is a collection of tools and best practices for scaffolding, package management, and build, preview, and test automation.

### Install

1. [Install yeoman](https://github.com/yeoman/yeoman/wiki/Manual-Install)
1. Install bower packages. This adds them to the `app/bower_components` directory.

        $ bower install

1. Install grunt plugins. This adds them to `package.json` after installation.

        $ npm install -D grunt-contrib-handlebars
        $ npm install -D grunt-recess
        $ npm install -D grunt-s3

1. Install packages. This adds them to `package.json` after installation.

        $ npm install -D jed
        $ npm install -D mocha

1. Download [ba-debug.js](https://github.com/cowboy/javascript-debug/blob/master/ba-debug.js) and copy to the `app/scripts/vendor` directory.

### Development process

Yeoman comes with a built-in preview server. While the server is running, the LiveReload watch process automatically compiles source files and refreshes your browser whenever a change is made. Scripts are automatically run against JSHint to ensure they're following language best-practices. The sources can be configured in `Gruntfile.js`.

If you'd like to use additional Yeoman (bower) packages, `yeoman install <package name>` them and then copy the necessary files from the `component`/`app/component` directories to the `app/scripts/vendor` directory.

* Run yeoman server, write code, and watch your changes auto reload!

        $ yeoman server

* Lint JavaScript code for errors and potential problems.

        $ yeoman lint

### Build process

The build process constructs an optimized version of the app that's ready to deploy. The build process is an opinionated workflow. I substituted two tasks. Coffeescript is not used, so I aliased the coffee task with nothing. Less CSS is used instead of SASS so the compass task was aliased with the [recess](https://github.com/twitter/recess) task.

* Create dist directory containing optimized version of app ready for deploying.

        $ yeoman build

### Test process

Unit tests are run in a headless WebKit via PhantomJS.

* Run yeoman server and mocha test runner.

        $ yeoman server:test

### Deployment process

Once deployed, this app will be a [static website hosted on Amazon S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).
Deployment is done with [grunt-s3](https://npmjs.org/package/grunt-s3), a grunt task that automates the upload/download/delete of files to/from Amazon S3.

1. Create a `setenv.sh` script containing the following:

        export AWS_ACCESS_KEY_ID=<ACCESS_KEY_ID>
        export AWS_SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>

1. Build your app if you haven't done so yet.

1. Deploy your code.

        $ yeoman deploy

## TODO

* Debug level should be predicated on environment variable.
* Delete auth-buttons.less
* Make forms resize like so: http://twitter.github.com/bootstrap/examples/signin.html
* Configure grunt-contrib-handlebars to precompile Handlebars templates to JST files
* Update all text to use Jed & i18n
* Dynamic documentation using [dox](https://github.com/visionmedia/dox) / [jsdoc-toolkit](http://code.google.com/p/jsdoc-toolkit/) / [docco](http://lostechies.com/derickbailey/2011/12/14/annotated-source-code-as-documentation-with-docco/)

## Acknowledgements

* [yeoman-backbone-require-handlebars-sass](https://github.com/forty4/yeoman-backbone-require-handlebars-sass)
* [addyosmani's backbone ToDo example](https://github.com/addyosmani/todomvc/tree/gh-pages/architecture-examples/backbone)
* [jshirley's form handlebars helpers](https://gist.github.com/jshirley/3409070)

