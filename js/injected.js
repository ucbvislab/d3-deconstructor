var VisDeconstruct = require('d3deconstructor');
var $ = require('jquery');

var contextElem;
document.addEventListener("contextmenu", function(event) {
    contextElem = event.target;
});

document.addEventListener("pageDeconEvent", function () {
    console.log("about to deconstruct");
    buildOverlay($("html")[0], true);
    setTimeout(pageDeconstruct, 10);
});

document.addEventListener("nodeDeconEvent", function () {
    if (contextElem instanceof SVGElement) {
        if (contextElem.tagName !== "svg") {
            contextElem = contextElem.ownerSVGElement;
        }

        buildOverlay(contextElem, false);
        setTimeout(function() {
            visDeconstruct(contextElem);
        }, 10);
    }
    else {

    }
});

function buildOverlay(domElem, fullPage) {
    var overlay;
    if (fullPage) {
        overlay = $('<div class="loadingOverlayFullPage"></div>');
        $(overlay).append(text);
    }
    else {
        var elemOffset = $(domElem).offset();
        overlay = $('<div class="loadingOverlay"></div>');
        $(overlay).css("top", elemOffset.top);
        $(overlay).css("left", elemOffset.left);

        var rect = domElem.getBoundingClientRect();
        $(overlay).css("width", rect.width);
        $(overlay).css("height", rect.height);
    }

    var text = $('<div class="overlayText">Deconstructing...</div>');
    $(overlay).append(text);
    $("html").append(overlay);
}

/**
 * Accepts a top level SVG node and deconstructs it by extracting data, marks, and the
 * mappings between them.
 * @param svgNode - Top level SVG node of a D3 visualization.
 */
function visDeconstruct(svgNode) {
    var deconstructed = VisDeconstruct.deconstruct(svgNode);

    var deconData = [{
        schematized: deconstructed.schematizedData,
        ids: deconstructed.dataNodes.ids
    }];

    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("deconDataEvent", true, true, deconData);
    document.dispatchEvent(evt);
}


function pageDeconstruct() {
    var deconstructed = VisDeconstruct.pageDeconstruct();

    var deconData = [];
    var nodes = [];
    var ids = [];

    $.each(deconstructed, function(i, decon) {
        nodes = nodes.concat(decon.dataNodes.nodes);
        ids = ids.concat(decon.dataNodes.ids);
        //updaters.push(new VisUpdater(svgNode, decon.dataNodes.nodes, decon.dataNodes.ids,
        //    decon.schematizedData));
        var deconDataItem = {
            schematized: decon.schematizedData,
            ids: decon.dataNodes.ids
        };
        deconData.push(deconDataItem);
    });

    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("deconDataEvent", true, true, deconData);
    document.dispatchEvent(evt);
}