/*global define:false, describe: false, before:false, after: false, beforeEach: false, afterEach: false, it:false, expect: false */
define(['modules/todo', 'jquery', 'underscore', 'backbone'], function(Todo, $, _, Backbone) {
    'use strict';

    describe('Todo Module', function() {

        var todos;
        var layout;
        var todoIdArray;

        before(function(done) {
            console.log('[TEST] Entering Todo Module before()...');

            // Instantiate layout.
            layout = new Backbone.Layout();

            // Fetch test todos list from *localStorage*.
            todos = new Todo.List({ namespace: 'todos-test' });
            todos.fetch();
            todoIdArray = todos.map(function(model) { return model.id; });
            _.each(todoIdArray, function(id) { todos.get(id).destroy(); });

            // Instantiate views and insert them into layout.
            var form = new Todo.Views.Form({collection: todos});
            var toggle = new Todo.Views.ToggleAll({collection: todos});
            var list = new Todo.Views.List({collection: todos});
            var stats = new Todo.Views.Stats({collection: todos});
            layout.insertView(form);
            layout.insertView(toggle);
            layout.insertView(list);
            layout.insertView(stats);

            // Render views
            layout.render().then(function() {
                // Attach the layout to this DOM.
                $('#sandbox').empty().append(layout.el);

                // `backbone.layoutmanager` renders views asynchronously.
                // It must be done before any tests are run.
                done();
            });

            console.log($('body'));
        });

        after(function(done) {
            console.log('[TEST] Entering Todo Module after()...');

            // Remove all test todos list from *localStorage*.
            todos.fetch();
            todoIdArray = todos.map(function(model) { return model.id; });
            _.each(todoIdArray, function(id) { todos.get(id).destroy(); });

            done();
        });

        describe('Adding a todo', function() {

            beforeEach(function(done) {
                console.log('[TEST] Entering Todo Module / Adding a todo beforeEach()...');

                // User enters new todo and clicks enter.
                $('#new-todo').val('Learn phantom.js testing');
                //console.log('new-todo=[" + $('#new-todo').val() + "]');
                var e = $.Event('keypress');
                e.which = Todo.Constants.ENTER_KEY;
                $('#new-todo').trigger(e);
                //console.log('new-todo=[" + $('#new-todo').val() + "]');
                expect(todos.length).to.equal(1);

                done();
            });

            afterEach(function(done) {
                console.log('[TEST] Entering Todo Module / Adding a todo afterEach()...');

                todos.reset();
                done();
            });

            it('should display correct # todos left.', function(done) {
                //console.log($('#todo-count strong'));
                expect($('#todo-count strong').text()).to.equal('1');
                done();
            });

            it('should display the todo in the todo list.', function(done) {
                //console.log($('#todo-list li div.view label'));
                expect($('#todo-list li div.view label').text()).to.equal('Learn phantom.js testing');
                done();
            });

        });

        describe('Deleting a todo', function() {

            beforeEach(function(done) {
                todos.add(new Todo.Model({title: 'Learn mocha testing', completed: false}));
                expect(todos.length).to.equal(1);

                // User clicks the delete button next to the todo.
                $('#todo-list li div.view button.destroy').trigger('click');

                done();
            });

            afterEach(function(done) {
                todos.reset();
                done();
            });

            it('should display correct # todos left.', function() {
                //console.log($('#todo-count strong'));
                expect($('#todo-count strong').text()).to.equal('0');
            });

            it('should not display the todo in the todo list.', function() {
                //console.log($('#todo-list li div.view label'));
                expect($('#todo-list li div.view label').text()).to.not.equal('Learn mocha testing');
            });

        });

        describe('Editing a todo', function() {

            beforeEach(function(done) {
                todos.add(new Todo.Model({title: 'Learn about jquery events', completed: false}));
                expect(todos.length).to.equal(1);

                // User double clicks the todo and updates text.
                $('#todo-list li div.view label').text('Learn more about jquery events');

                done();
            });

            afterEach(function(done) {
                todos.reset();
                done();
            });

            it('should display the updated todo in the todo list.', function() {
                //console.log($('#todo-list li div.view label'));
                expect($('#todo-list li div.view label').text()).to.equal('Learn more about jquery events');
            });

        });

        describe('Completing a todo', function() {

            beforeEach(function(done) {
                todos.add(new Todo.Model({title: 'Learn about chai assertions', completed: false}));
                expect(todos.length).to.equal(1);

                // User toggles all todos as completed.
                //$('input#toggle-all').trigger('click');

                // User toggles a todo as completed.
                $('#todo-list li div.view input.toggle').trigger('click');
                //console.log($('#todo-list').html());
                expect($('#todo-list li').hasClass('completed')).to.be.true;

                done();
            });

            afterEach(function(done) {
                todos.reset();
                done();
            });

            it('should display the todo in the all filter.', function() {
                //console.log($('#todo-list').html());
                expect($('#todo-list li').hasClass('hidden')).to.be.false;
            });

            it('should not display the todo in the active filter.', function() {
                // Trigger a filter event by this collection.
                todos.trigger('filter', 'active');
                //console.log($('#todo-list').html());
                expect($('#todo-list li').hasClass('hidden')).to.be.true;
            });

            it('should display the todo in the completed filter.', function() {
                // Trigger a filter event by this collection.
                todos.trigger('filter', 'completed');
                //console.log($('#todo-list').html());
                expect($('#todo-list li').hasClass('hidden')).to.be.false;
            });

        });

    });

});