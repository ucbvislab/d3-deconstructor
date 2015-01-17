var deconApp = angular.module('deconApp');

deconApp.controller('MappingsListController', ['$scope', 'VisDataService',
    function($scope, visDataService) {
        $scope.data = visDataService.visData;
        $scope.ids = visDataService.ids;
        $scope.selectedMarkGroup = visDataService.selectedMarkGroup;

        $scope.isLinear = function (mapping) {
            return mapping.type === "linear";
        };

        $scope.isNominal = function (mapping) {
            return mapping.type === "nominal";
        };
    }
]);