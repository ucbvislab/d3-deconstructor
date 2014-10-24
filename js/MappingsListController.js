var restylingApp = angular.module('restylingApp');

restylingApp.controller('MappingsListController', ['$scope', 'VisDataService',
    function($scope, visDataService) {
        $scope.data = visDataService.visData;
        $scope.ids = visDataService.ids;
        $scope.selectedSchema = visDataService.selectedSchema;

        $scope.isLinear = function (mapping) {
            return mapping.type === "linear";
        };

        $scope.isNominal = function (mapping) {
            return mapping.type === "nominal";
        };
    }
]);