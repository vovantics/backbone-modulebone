/*global define: false */
define([
    // Libraries.
    'jed',
    'handlebars',
    'debug',

    // Modules.
    'i18n!modules/nls/locale_data'
],
function(Jed, Handlebars, debug, localeData) {
    'use strict';

    var i18n = new Jed({
        // Generally output by a .po file conversion
        locale_data : localeData,
        'domain' : 'messages'
    });

    Handlebars.registerHelper('_', function(key) {
        debug.info('Entering nls/_()...');
        return i18n.gettext(key);
    });

    return i18n;
});
