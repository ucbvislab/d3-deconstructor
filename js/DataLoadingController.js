var angular = require('angular');

var deconApp = angular.module('deconApp');

deconApp.controller('DataLoadingController', ['$scope', 'VisDataService',
    function($scope, visDataService) {
        $scope.visDataService = visDataService;
    }
]);