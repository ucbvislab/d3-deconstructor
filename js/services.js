var _ = require('underscore');
var deconApp = angular.module('deconApp');

deconApp.service('VisDataService', ['Schema', '$rootScope', '$timeout',  function(Schema, $rootScope, timer) {
    var port;
    var pageData = [];
    var visData = [];
    var ids = [];
    var selectedVis = {val: 0};
    var selectedSchema = {val: 0};
    var dataLoading = {val: false};

    function updateNodes(attr, val, ids) {
        var message = {
            type: "update",
            attr: attr,
            val: val,
            ids: ids,
            vis: selectedVis
        };
        sendMessage(message);
        visData[selectedSchema.val].updateWithMessage(message);
    }

    function selectSchema(schema) {
        selectedSchema.val = visData.indexOf(schema);
    }

    function getSelected() {
        return visData[selectedSchema.val];
    }

    function updateDataWithLinearMapping(mapping, schemaInd) {
        // update the attribute values according to the new mapping
        var attrArray = visData[schemaInd].attrs[mapping.attr];
        var schema = visData[schemaInd];
        _.each(attrArray, function(attrVal, ind) {
            var newAttrVal = 0;
            _.each(mapping.params.coeffs, function(coeff, coeffInd) {
                if (coeffInd < mapping.data.length) {
                    newAttrVal += coeff * schema.data[mapping.data[coeffInd]][ind];
                    console.log(coeff * schema.data[mapping.data[coeffInd]][ind] + "+");
                }
                else {
                    console.log(coeff);
                    newAttrVal += coeff;
                }
            });

            updateNodes(mapping.attr, newAttrVal, [visData[schemaInd].ids[ind]]);
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
        return pageData[selectedSchema.val];
    }

    function selectVis(visID) {
        selectedVis = visID;
        ids = pageData[visID].ids;

        while (visData.length > 0) {
            visData.pop();
        }

        _.each(pageData[visID].schematized, function(schema) {
            visData.push(Schema.fromDeconData(schema));
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
        selectSchema: selectSchema,
        getSelected: getSelected,
        selectedSchema: selectedSchema,
        pageData: pageData,
        selectedVis: selectedVis,
        visData: visData,
        selectVis: selectVis,
        dataLoading: dataLoading
    }
}]);