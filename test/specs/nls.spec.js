/*global define:false, describe: false, before:false, after: false, beforeEach: false, afterEach: false, it:false, expect: false, i18n: false */
define([
    // Libraries.
    'jquery',
    'underscore',
    'backbone',

    // Modules.
    'modules/meta',
    'modules/session',
    'modules/nls'
],
function($, _, Backbone, Meta, Session, i18n) {
    'use strict';

    describe('NLS Module', function() {

        describe('Native text', function() {

            beforeEach(function(done) {
                console.log('[TEST] Entering NLS Module / Native text before()...');

                done();
            });

            afterEach(function(done) {
                console.log('[TEST] Entering NLS Module / Native text after()...');

                done();
            });

            it('should be rendered in French for French Canadian user.', function(done) {

                localStorage.setItem('locale', 'fr-ca');
                expect(i18n.gettext('About Us')).to.equal('À propos de nous');
                done();
            });

            /*it('should be rendered in English for English American user.', function(done) {

                localStorage.clear();
                localStorage.setItem('locale', 'en-us');
                expect(i18n.gettext('About Us')).to.equal('About Us');
                done();
            });*/

        });

    });
});