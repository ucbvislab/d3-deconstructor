var angular = require('angular');
var _ = require('underscore');
var VisDeconstruct = require('d3deconstructor');
var saveAs = require('FileSaver.js');

var deconApp = angular.module('deconApp');

deconApp.controller('DataTableController', ['$scope', 'orderByFilter', 'VisDataService',
    function($scope, orderByFilter, visDataService) {

        $scope.selectedVis = visDataService.selectedVis;
        $scope.selectSchema = visDataService.selectSchema;

        $scope.visSelectorVal = 0;
        $scope.visDataService = visDataService;
        $scope.data = visDataService.visData;


        $scope.ids = visDataService.ids;
        $scope.selectedRows = [];

        $scope.changeVis = function() {
            visDataService.selectVis($scope.visSelectorVal);
        };

        $scope.getNumber = function(number) {
            return new Array(number);
        };

        $scope.saveFilename = "";

        $scope.getSchemaSize = function(schema) {
            var dataField = _.keys(schema.data)[0];
            return schema.data[dataField].length;
        };

        $scope.hasMarks = function(schema) {
            return schema.attrs !== null;
        };

        $scope.saveData = function() {
            saveAs(new Blob([JSON.stringify(visDataService.visData)]), $scope.saveFilename);
        };

        $scope.saveSchemaDataCSV = function(schema, ind) {
            var blob = new Blob([schema.getDataCSVBlob()], { type: "text/csv;charset=utf-8" });
            saveAs(blob, "schema-"+ind.toString()+".csv");
        };

        $scope.saveVisDataCSV = function() {
            var orderedVisData = orderByFilter(visDataService.visData, 'numFields', true);
            for (var i = 0; i < orderedVisData.length; ++i) {
                $scope.saveSchemaDataCSV(orderedVisData[i], i+1);
            }
        };

        $scope.findSchemaById = function(id) {
            var schemaInd;
            _.each($scope.data, function(schema, ind) {
                if (schema.ids.indexOf(id) > -1) {
                    schemaInd = ind;
                }
            });
            return schemaInd;
        };

        $scope.selectRow = function(schema, ind) {
            var rowSchemaInd = visDataService.visData.indexOf(schema);
            if (rowSchemaInd !== visDataService.getSelected()) {
                visDataService.selectSchema($scope.data[rowSchemaInd]);
            }

            if ($scope.selectedRows.indexOf(ind) !== -1) {
                $scope.selectedRows.splice($scope.selectedRows.indexOf(ind), 1);
            }
            else {
                $scope.selectedRows.push(ind);
            }
        };

        $scope.rowIsSelected = function(schema, ind) {
            if (schema === visDataService.getSelected()) {
                return $scope.selectedRows.indexOf(ind) !== -1;
            }
            else {
                return false;
            }
        };

        $scope.splitSchema = function() {
            if ($scope.selectedRows.length > 0) {
                var schema = visDataService.getSelected();
                $scope.selectedRows = $scope.selectedRows.sort(function(a, b){return b-a});

                var newSchema = {
                    ids: [],
                    data: {},
                    attrs: {},
                    nodeAttrs: [],
                    mappings: []
                };

                _.each($scope.selectedRows, function(ind, count) {
                    newSchema.ids.push(schema.ids[ind]);
                    schema.ids.splice(ind, 1);
                    newSchema.nodeAttrs.push(schema.nodeAttrs[ind]);
                    schema.nodeAttrs.splice(ind, 1);

                    _.each(schema.data, function(val, key) {
                        if (newSchema.data[key]) {
                            newSchema.data[key].push(val[ind]);
                        }
                        else {
                            newSchema.data[key] = [val[ind]]
                        }
                        schema.data[key].splice(ind, 1);
                    });
                    _.each(schema.attrs, function(val, key) {
                        if (newSchema.attrs[key]) {
                            newSchema.attrs[key].push(val[ind]);
                        }
                        else {
                            newSchema.attrs[key] = [val[ind]]
                        }
                        schema.attrs[key].splice(ind, 1);
                    });
                });
                newSchema.schema = _.keys(newSchema.data);
                newSchema.numNodes = newSchema.ids.length;
                schema.numNodes = schema.ids.length;

                schema.mappings = VisDeconstruct.extractMappings(schema);
                newSchema.mappings = VisDeconstruct.extractMappings(newSchema);
                $scope.data.push(newSchema);
                $scope.selectedRows = [];
            }
        };
    }
]);
