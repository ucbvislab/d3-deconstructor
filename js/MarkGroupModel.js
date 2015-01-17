var _ = require('underscore');
var deconApp = angular.module('deconApp');
var MarkGroup = require('d3-decon-lib').MarkGroup;

deconApp.factory('MarkGroup', function () {
    return MarkGroup;
});