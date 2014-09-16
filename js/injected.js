"use strict";

var VisDeconstruct = require('d3deconstructor');
var $ = require('jquery');

var updaters = [];

pageDeconstruct();

document.addEventListener("deconEvent", function() {
    console.log("let's deconstruct again");
    pageDeconstruct();
});

document.addEventListener("updateEvent", function(event) {
    var updateMessage = event.detail;
    updaters[updateMessage.vis].updateNodes(updateMessage.ids, updateMessage.attr, updateMessage.val);
});

document.addEventListener("createEvent", function(event) {
    var createMessage = event.detail;
    updaters[createMessage.vis].createNodes(createMessage.ids);
});

/**
 * Accepts a top level SVG node and deconstructs it by extracting data, marks, and the
 * mappings between them.
 * @param svgNode - Top level SVG node of a D3 visualization.
 */
function visDeconstruct(svgNode) {
    var deconstructed = VisDeconstruct.deconstruct(svgNode);

    //updaters.push(new VisUpdater(svgNode, deconstructed.dataNodes.nodes, deconstructed.dataNodes.ids,
    //    deconstructed.schematizedData));

    console.log(deconstructed.schematizedData);

    var deconData = {
        schematized: deconstructed.schematizedData,
        ids: deconstructed.dataNodes.ids
    };

    // Now send a custom event with dataNodes to the content script
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("deconDataEvent", true, true, deconData);
    document.dispatchEvent(evt);
}


function pageDeconstruct() {
    var svgNodes = $('svg');
    var deconstructed = [];
    var nodes = [];
    var ids = [];

    $.each(svgNodes, function(i, svgNode) {
        var children = $(svgNode).find('*');
        var isD3Node = false;
        $.each(children, function(i, child) {
            if (child.__data__) {
                isD3Node = true;
                return false;
            }
        });

        if (isD3Node) {
            var decon = VisDeconstruct.deconstruct(svgNode);
            nodes = nodes.concat(decon.dataNodes.nodes);
            ids = ids.concat(decon.dataNodes.ids);
            //updaters.push(new VisUpdater(svgNode, decon.dataNodes.nodes, decon.dataNodes.ids,
            //    decon.schematizedData));
            var deconData = {
                schematized: decon.schematizedData,
                ids: decon.dataNodes.ids
            };
            deconstructed.push(deconData);
        }
    });

    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("deconDataEvent", true, true, deconstructed);
    document.dispatchEvent(evt);
}
