var angular = require('../lib/angular');

var restylingApp = angular.module('restylingApp', []);

require('./models/SchemaModel');
require('./services');
require('./directives');
require('./controllers/DataTableController');

restylingApp.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});
