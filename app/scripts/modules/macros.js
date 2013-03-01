define([
    // Libraries.
    "jquery",
    "underscore",
    "backbone",
    "handlebars",

    // Modules
    'modules/utils',

    'moment'
],

function($, _, Backbone, Handlebars, Utils) {

    Handlebars.registerHelper("formatPhoneNumber", function(phoneNumber) {
        phoneNumber = phoneNumber.toString();
        return "(" + phoneNumber.substr(0,3) + ") " + phoneNumber.substr(3,3) + "-" + phoneNumber.substr(6,4);
    });

    form_inline_templates = {
        'basic_field' : Handlebars.compile(
            '<div class="control-group{{#classNames}} {{.}}{{/classNames}}">' +
                '{{#if withLabel}}<label class="control-label" for="{{id}}">{{label}}</label>{{/if}}' +
                '<div class="controls">' +
                    '<input type="{{type}}" id="{{id}}" name="{{name}}" placeholder="{{label}}" value="{{value}}" class="{{#if required}}required{{/if}} {{#inputClassNames}}{{.}} {{/inputClassNames}}">' +
                    '{{#help_inline}}<p class="help-inline">{{{.}}}</p>{{/help_inline}}' +
                    '{{#help_block}}<p class="help-block">{{{.}}}</p>{{/help_block}}' +
                '</div>' +
            '</div>'),
        'textarea_field' : Handlebars.compile(
            '<div class="control-group{{#classNames}} {{.}}{{/classNames}}">' +
                '{{#if withLabel}}<label class="control-label" for="{{id}}">{{label}}</label>{{/if}}' +
                '<div class="controls">' +
                    '<textarea id="{{id}}" name="{{name}}" placeholder="{{label}}" class="{{#if required}}required{{/if}} {{#inputClassNames}}{{.}} {{/inputClassNames}}">{{{value}}}</textarea>' +
                    '{{#help_inline}}<p class="help-inline">{{{.}}}</p>{{/help_inline}}' +
                    '{{#help_block}}<p class="help-block">{{{.}}}</p>{{/help_block}}' +
                '</div>' +
            '</div>'),
        'select_field' : Handlebars.compile(
            '<div class="control-group{{#classNames}} {{.}}{{/classNames}}">' +
                '{{#if withLabel}}<label class="control-label" for="{{id}}">{{label}}</label>{{/if}}' +
                '<div class="controls">' +
                    '<select id="{{id}}" name="{{name}}">{{#options}}<option value="{{id}}"{{#selected}} selected{{/selected}}>{{name}}</option>{{/options}}</select>' +
                    '{{#help_inline}}<p class="help-inline">{{{.}}}</p>{{/help_inline}}' +
                    '{{#help_block}}<p class="help-block">{{{.}}}</p>{{/help_block}}' +
                '</div>' +
            '</div>'),
        'date_field' : Handlebars.compile(
            '<div class="control-group{{#classNames}} {{.}}{{/classNames}}">' +
                '{{#if withLabel}}<label class="control-label" for="{{id}}">{{label}}</label>{{/if}}' +
                '<div class="controls">' +
                    '<select class="input-mini" id="{{name}}-month" name="{{name}}-month">{{#monthoptions}}<option value="{{id}}"{{#selected}} selected{{/selected}}>{{name}}</option>{{/monthoptions}}</select>' +
                    '<select class="input-mini" id="{{name}}-day" name="{{name}}-day">{{#dayoptions}}<option value="{{id}}"{{#selected}} selected{{/selected}}>{{name}}</option>{{/dayoptions}}</select>' +
                    '<select class="input-small" id="{{name}}-year" name="{{name}}-year">{{#yearoptions}}<option value="{{id}}"{{#selected}} selected{{/selected}}>{{name}}</option>{{/yearoptions}}</select>' +
                    '{{#help_inline}}<p class="help-inline">{{{.}}}</p>{{/help_inline}}' +
                    '{{#help_block}}<p class="help-block">{{{.}}}</p>{{/help_block}}' +
                '</div>' +
            '</div>'),
        'options_field' : Handlebars.compile(
            '<div class="control-group{{#classNames}} {{.}}{{/classNames}}">' +
                '{{#if withLabel}}<label class="control-label" for="{{id}}">{{label}}</label>{{/if}}' +
                '<div class="controls">' +
                    '{{#options}}<label class="{{type}}"><input type="{{type}}" name="{{name}}" value="{{value}}" {{#if checked}}checked{{/if}}>{{label}}</label>{{/options}}' +
                    '{{#help_inline}}<p class="help-inline">{{{.}}}</p>{{/help_inline}}' +
                    '{{#help_block}}<p class="help-block">{{{.}}}</p>{{/help_block}}' +
                '</div>' +
            '</div>')
    };

    // Returns the HTML for a form using handlebars partials and
    // helpers to keep things DRY.
    Handlebars.registerHelper('render_form', function(form) {
        debug.info("Entering macros/render_form()...");

        var buffer = '',
            form_buttons = "\n",
            name_map = {};

        if( (typeof form !== "object") && (form !== null) ) {
            return 'No form specified, nothing to render.';
        }

        // Default style is to right align labels and float them to
        // the left to make them appear on the same line as controls.
        if ( !form.withLabel ) {
            form.withLabel = false;
        }

        // Default method is post.
        if ( !form.method ) {
            form.method = 'post';
        }

        if ( form.withLabel ) {
            buffer = '<form id="' + form.id + '" method="' + form.method + '" class="form-horizontal">';
        }
        else {
            buffer = '<form id="' + form.id + '" method="' + form.method + '">';
        }
        buffer += form.fields.length > 0 ? '<fieldset>' : '';

        if( (typeof form !== "object") && (form !== null) ) {
            return 'Invalid form passed in, I need an object!';
        }

        _.each( form.fields, function(field, i) {

            var method = ( field.type || 'text' ) + '_field',
            fn = Handlebars.helpers[method],
            template = form_inline_templates[method],
            val;

            if ( field.type === 'password' ) {
                method = 'text_field';
                fn = Handlebars.helpers[method];
                template = form_inline_templates[method];
            }

            if ( $.isFunction(fn) || template ) {
                val = $.isPlainObject(form.values) ? form.values[field.name] : null;

                if ( val && !field.value ) {
                    if ( field.type === 'select' ) {
                        _.each( field.options, function(option) {
                            if ( typeof option.selected === 'undefined' && option.id === val ) {
                                option.selected = true;
                            }
                        });
                    }
                    else if ( field.type === 'options' ) {
                        // Options can be different, so we have to check at each level...
                        _.each( field.options, function(option) {
                            if ( typeof option.checked === 'undefined' && option.value === val ) {
                                option.checked = true;
                            }
                        });
                    }
                    else {
                        field.value = form.values[field.name];
                    }
                }
                // Options can be nested, so we have to check each option in the group, too
                else if ( form.values && field.type === 'options' ) {
                    // Options can be different, so we have to check at each level...
                    _.each( field.options, function(option) {
                        var val = form.values[option.name];
                        if ( val && typeof option.checked === 'undefined' && option.value === val ) {
                            option.checked = true;
                        }
                    });
                }

                if ( !fn ) {
                    field.template = method;
                    fn = Handlebars.helpers['input_field'];
                }

                field.withLabel = form.withLabel;

                buffer += fn.apply(this, [ field ]);
            }
        });

        if ( typeof form.buttons === 'undefined' ) {
            form.buttons = [ { classNames : [ 'btn', 'btn-primary' ], label : 'Submit' } ];
        }

        if ( $.isArray(form.buttons) ) {
            $.each( form.buttons, function (b, button) {
                if ( !button.classNames ) {
                    button.classNames = [ 'btn' ];
                }
                else if ( !$.isArray( button.classNames ) ) {
                    button.classNames = [ button.classNames ];
                }
                if ( button.link ) {
                    form_buttons += '<a class="' + button.classNames.join(' ') + '" href="' + button.link + '">' + button.label + "</a>\n";
                } else {
                    form_buttons += '<button id="' + button.id + '" class="' + button.classNames.join(' ') + '" data-loading-text="Wait...">' + button.label + "</button>\n";
                }
            });
        }

        buffer += '<div class="form-actions">' + form_buttons + '</div>';
        buffer += form.fields.length > 0 ? '</fieldset>' : '';
        buffer += '</form>';

        return new Handlebars.SafeString(buffer);
    });

    Handlebars.registerHelper('input_field', function(cfg) {
        debug.info("Entering macros/input_field()...");

        var template = form_inline_templates[ cfg.template || 'basic_field' ];

        if ( $.type( cfg.id ) !== "string" ) {
            cfg.id = cfg.name;
        }

        $.each( [ 'error', 'warning', 'success' ], function(i, level) {
            if ( $.type( cfg[level] ) === "string" ) {
                if ( $.isArray( cfg.classNames ) ) {
                    cfg.classNames.push(level);
                }
                else {
                    if ( cfg.classNames ) {
                        cfg.classNames = [ level, cfg.classNames ];
                    }
                    else {
                        cfg.classNames = [ level ];
                    }
                }

                if ( cfg.help_block && !isArray( cfg.help_block ) ) {
                    cfg.help_block = [ cfg.help_block ];
                }
                else if ( !cfg.help_block ) {
                    cfg.help_block = [];
                }

                cfg.help_block.push( cfg[level] );
            }
        });

        // TODO
        /*if ( cfg.required ) {
            if ( cfg.help_inline && !$.isArray( cfg.help_inline ) ) {
                cfg.help_inline = [ cfg.help_inline ];
            }
            else if ( !cfg.help_inline ) {
                cfg.help_inline = [];
            }
            cfg.help_inline.unshift('<i class="icon-asterisk"></i>');
        }*/

        return template(cfg);
    });

    Handlebars.registerHelper('text_field', function(label, name, value, id) {
        debug.info("Entering macros/text_field()...");

        var cfg = {
            type : 'text'
        };

        if ( $.isPlainObject(label) ) {
            cfg = $.extend({}, cfg, label);
        }
        else {
            cfg.label = label;
            cfg.name = name;
            cfg.value = value;
            cfg.id = id;
        }

        return Handlebars.helpers.input_field(cfg);
    });

    Handlebars.registerHelper('select_field', function(cfg) {
        debug.info("Entering macros/select_field()...");

        if ( typeof cfg.template !== 'string' ) {
            cfg.template = 'select_field';
        }
        return Handlebars.helpers.input_field(cfg);
    });

    Handlebars.registerHelper('textarea_field', function(label, name, value, id) {
        debug.info("Entering macros/textarea_field()...");

        var cfg = {
            type : 'text'
        };

        //if ( isObject(label) ) {
        if( typeof label === "object" ) {
            cfg = $.extend({}, cfg, label);
            //cfg = Y.merge(cfg, label);
        }
        else {
            cfg.label = label;
            cfg.name = name;
            cfg.value = value;
            cfg.id = id;
        }

        cfg.template = 'textarea_field';
        return Handlebars.helpers.input_field(cfg);
    });

    Handlebars.registerHelper('options_field', function(cfg) {
        debug.info("Entering macros/options_field()...");

        if( typeof cfg !== "object" ) {
            debug.error('Invalid configuration passed into options_field, expected an object and got ' + typeof cfg);
            return '';
        }
        cfg.template = 'options_field';

        _.each( cfg.options, function(option) {
            if ( option.type === 'radio' || option.type === 'checkbox' ) {
                // Don't ask... I should learn how to code?
            }
            else {
                option.type = 'checkbox';
            }

            // Convert to a boolean from any truthy value
            option.checked = option.checked ? true : false;
        });
        return Handlebars.helpers.input_field(cfg);
    });

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function getMonthsAsOptions(monthSelected) {
        var options = _.map(_.range(0, 12), function(id) {
            var value = id < 9 ? '0' + (id + 1).toString() : (id + 1).toString();
            var name = monthNames[id];
            return monthSelected === value ? { id: value, name: name, selected: true } : { id: value, name: name };
        });
        return options;
    }

    function getDaysInMonthAsOptions(monthSelected, daySelected, yearSelected) {
        var daysMax = moment(yearSelected + "-" + monthSelected, "YYYY-MM").daysInMonth();
        var options = _.map(_.range(1, daysMax + 1), function(day) {
            return daySelected == day ? { id: day, name: day, selected: true } : { id: day, name: day };
        });
        return options;
    }

    function getYearsAsOptions(yearSelected) {
        var today = new Date();
        var yearStart = today.getFullYear() - 100;
        var yearEnd = today.getFullYear();
        var yearRange = yearStart < yearEnd ?
            _.range(yearStart, yearEnd + 1) :
            _.range(yearStart, yearEnd - 1, -1);
        var options = _.map(yearRange, function(year) {
            return yearSelected == year ? { id: year, name: year, selected: true } : { id: year, name: year };
        });
        return options;
    }

    Handlebars.registerHelper('date_field', function(cfg) {
        debug.info("Entering macros/date_field()...");

        if ( typeof cfg.template !== 'string' ) {
            cfg.template = 'date_field';
        }

        var isoDateArray = cfg.value.split('-');
        var yearSelected = isoDateArray[0];
        var monthSelected = isoDateArray[1];
        var daySelected = isoDateArray[2];

        // Generate options for month, day, and year fields.
        cfg.monthoptions = getMonthsAsOptions(monthSelected);
        cfg.dayoptions = getDaysInMonthAsOptions(monthSelected, daySelected, yearSelected);
        cfg.yearoptions = getYearsAsOptions(yearSelected);

        return Handlebars.helpers.input_field(cfg);
    });

    Handlebars.registerHelper('password_field', function(label, name, value, id) {
        debug.info("Entering macros/password_field()...");

        if ( typeof id !== 'string' ) {
            id = YUI().guid('hb_');
        }
        return '<div class="clearfix">' +
        '<label for="' + id + '">' + label + '</label>' +
        '<div class="input">' +
        '<input type="password" name="' + name + '">' +
        '</div>' +
        '</div>';
    });

    return { getDaysInMonthAsOptions: getDaysInMonthAsOptions };
});
