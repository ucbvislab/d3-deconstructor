var _ = require('underscore');
var Deconstruct = require('d3-decon-lib').Deconstruct;
var saveAs = require('FileSaver.js');

var deconApp = angular.module('deconApp');

deconApp.controller('DataTableController', ['$scope', 'orderByFilter', 'VisDataService',
    function($scope, orderByFilter, visDataService) {

        $scope.selectedVis = visDataService.selectedVis;
        $scope.selectMarkGroup = visDataService.selectMarkGroup;

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

        $scope.getGroupSize = function(group) {
            var dataField = _.keys(group.data)[0];
            return group.data[dataField].length;
        };

        $scope.hasMarks = function(group) {
            return group.attrs !== null;
        };

        $scope.saveData = function() {
            saveAs(new Blob([JSON.stringify(visDataService.visData)]), $scope.saveFilename);
        };

        $scope.saveGroupDataCSV = function(group, ind) {
            var blob = new Blob([group.getDataCSVBlob()], { type: "text/csv;charset=utf-8" });
            saveAs(blob, "group-"+ind.toString()+".csv");
        };

        $scope.saveVisDataCSV = function() {
            var orderedVisData = orderByFilter(visDataService.visData, 'numFields', true);
            for (var i = 0; i < orderedVisData.length; ++i) {
                $scope.saveGroupDataCSV(orderedVisData[i], i+1);
            }
        };

        $scope.findGroupById = function(id) {
            var groupInd;
            _.each($scope.data, function(group, ind) {
                if (group.ids.indexOf(id) > -1) {
                    groupInd = ind;
                }
            });
            return groupInd;
        };

        $scope.selectRow = function(group, ind) {
            var rowGroupInd = visDataService.visData.indexOf(group);
            if (rowGroupInd !== visDataService.getSelected()) {
                visDataService.selectMarkGroup($scope.data[rowGroupInd]);
            }

            if ($scope.selectedRows.indexOf(ind) !== -1) {
                $scope.selectedRows.splice($scope.selectedRows.indexOf(ind), 1);
            }
            else {
                $scope.selectedRows.push(ind);
            }
        };

        $scope.rowIsSelected = function(group, ind) {
            if (group === visDataService.getSelected()) {
                return $scope.selectedRows.indexOf(ind) !== -1;
            }
            else {
                return false;
            }
        };

        $scope.splitGroup = function() {
            if ($scope.selectedRows.length > 0) {
                var group = visDataService.getSelected();
                $scope.selectedRows = $scope.selectedRows.sort(function(a, b){return b-a});

                var newGroup = {
                    ids: [],
                    data: {},
                    attrs: {},
                    nodeAttrs: [],
                    mappings: []
                };

                _.each($scope.selectedRows, function(ind, count) {
                    newGroup.ids.push(group.ids[ind]);
                    group.ids.splice(ind, 1);
                    newGroup.nodeAttrs.push(group.nodeAttrs[ind]);
                    group.nodeAttrs.splice(ind, 1);

                    _.each(group.data, function(val, key) {
                        if (newGroup.data[key]) {
                            newGroup.data[key].push(val[ind]);
                        }
                        else {
                            newGroup.data[key] = [val[ind]]
                        }
                        group.data[key].splice(ind, 1);
                    });
                    _.each(group.attrs, function(val, key) {
                        if (newGroup.attrs[key]) {
                            newGroup.attrs[key].push(val[ind]);
                        }
                        else {
                            newGroup.attrs[key] = [val[ind]]
                        }
                        group.attrs[key].splice(ind, 1);
                    });
                });
                newGroup.group = _.keys(newGroup.data);
                newGroup.numNodes = newGroup.ids.length;
                group.numNodes = group.ids.length;

                group.mappings = Deconstruct.extractMappings(group);
                newGroup.mappings = Deconstruct.extractMappings(newGroup);
                $scope.data.push(newGroup);
                $scope.selectedRows = [];
            }
        };
    }
]);
