var restylingApp = angular.module('restylingApp');

restylingApp.controller('DataLoadingController', ['$scope', 'VisDataService',
    function($scope, visDataService) {
        $scope.visDataService = visDataService;
    }
]);