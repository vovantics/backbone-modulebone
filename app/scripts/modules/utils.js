/*global define: false */
define(['underscore'], function (_) {
    'use strict';

    /**
     * Build up a new value from the array with an original seed value
     * (empty map) and a function. The function's first argument acc is
     * the return value of the previous function call and the second
     * argument field is the current element in the array.
     * arr = [{name: "name", value: "John Smith"}, ...]
     * Return: {name: "John Smith", age: 34}
    */
    function foldForm(arr) {
        return _(arr).reduce(function(acc, field) {
            acc[field.name] = field.value;
            return acc;
        }, {});
    }

    return {foldForm: foldForm};
});

