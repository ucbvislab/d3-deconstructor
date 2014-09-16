var angular = require('../lib/angular');
var $ = require('jquery');
var _ = require('underscore');

var restylingApp = angular.module('restylingApp');

restylingApp.service('VisDataService', ['Schema', '$rootScope',  function(Schema, $rootScope) {
    var port;
    var pageData = [];
    var visData = [];
    var ids = [];
    var selectedVis = {val: 0};
    var selectedSchema = {val: 0};

    function updateNodes(attr, val, ids) {
        var message = {
            type: "update",
            attr: attr,
            val: val,
            ids: ids,
            vis: selectedVis
        };
        sendMessage(message);
        visData[selectedSchema].updateWithMessage(message);
    }

    function selectSchema(schema) {
        console.log(visData);
        selectedSchema.val = visData.indexOf(schema);
        var selectedRows = [];
        console.log(selectedSchema.val);
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

    console.log("about to listen for incoming data");
    chrome.runtime.onMessage.addListener(function(message, sender) {
        console.log("received message");
        console.log(message);
        if (message.type === "restylingData") {
            console.log("received restyling data message.");
            $rootScope.$apply(function() {
                var data = message.data;
                data = $.extend([], data);

                _.each(data, function(datum) {
                    pageData.push(datum);
                });

                selectVis(selectedVis.val);

                port = chrome.tabs.connect(sender.tab.id, {name: 'd3decon'});
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
        selectVis: selectVis
    }
}]);