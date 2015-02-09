var _ = require('underscore');
var deconApp = angular.module('deconApp');

deconApp.service('VisDataService', ['MarkGroup', '$rootScope', '$timeout',  function(MarkGroup, $rootScope, timer) {
    var port;
    var pageData = [];
    var visData = [];
    var ids = [];
    var selectedVis = {val: 0};
    var selectedMarkGroup = {val: 0};
    var dataLoading = {val: false};

    var updateNodes = function(attr, val, ids) {
        var message = {
            type: "update",
            attr: attr,
            val: val,
            ids: ids,
            vis: selectedVis
        };
        sendMessage(message);
        visData[selectedMarkGroup.val].updateWithMessage(message);
    };

    var selectMarkGroup = function(markGroup) {
        selectedMarkGroup.val = visData.indexOf(markGroup);
    };

    var getSelected = function() {
        return visData[selectedMarkGroup.val];
    };

    function updateDataWithLinearMapping(mapping, groupInd) {
        // update the attribute values according to the new mapping
        var attrArray = visData[groupInd].attrs[mapping.attr];
        var group = visData[groupInd];
        _.each(attrArray, function(attrVal, ind) {
            var newAttrVal = 0;
            _.each(mapping.params.coeffs, function(coeff, coeffInd) {
                if (coeffInd < mapping.data.length) {
                    newAttrVal += coeff * group.data[mapping.data[coeffInd]][ind];
                    console.log(coeff * group.data[mapping.data[coeffInd]][ind] + "+");
                }
                else {
                    console.log(coeff);
                    newAttrVal += coeff;
                }
            });

            updateNodes(mapping.attr, newAttrVal, [visData[groupInd].ids[ind]]);
        });
    }

    chrome.runtime.onMessage.addListener(function(message, sender) {
        if (message.type === "restylingData") {
            $rootScope.$apply(function() {
                var data = message.data;
                data = $.extend([], data);

                _.each(data, function(datum) {
                    pageData.push(datum);
                });

                selectVis(selectedVis.val);

                port = chrome.tabs.connect(sender.tab.id, {name: 'd3decon'});
            });
            $rootScope.$apply(function() {
                var notLoading = function() {
                    dataLoading.val = false;
                };
                timer(notLoading, 0);
            });
        }
        if (message.type === "loadingInit") {
            console.log("received loading init message");
            $rootScope.$apply(function() {
                dataLoading.val = true;
            });
        }
    });

    function getPageData() {
        return pageData;
    }

    function getVisData() {
        return pageData[selectedMarkGroup.val];
    }

    function selectVis(visID) {
        selectedVis = visID;
        ids = pageData[visID].ids;

        while (visData.length > 0) {
            visData.pop();
        }

        _.each(pageData[visID].schematized, function(group) {
            visData.push(MarkGroup.fromJSON(group));
        });
    }

    function sendMessage(message) {
        port.postMessage(message);
    }

    return {
        ids: ids,
        sendMessage: sendMessage,
        updateDataWithLinearMapping: updateDataWithLinearMapping,
        updateNodes: updateNodes,
        selectMarkGroup: selectMarkGroup,
        getSelected: getSelected,
        selectedMarkGroup: selectedMarkGroup,
        pageData: pageData,
        selectedVis: selectedVis,
        visData: visData,
        selectVis: selectVis,
        dataLoading: dataLoading
    }
}]);