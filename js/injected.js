var VisDeconstruct = require('d3deconstructor');
var $ = require('jquery');

var contextElem;
document.addEventListener("contextmenu", function(event) {
    contextElem = event.target;
});

document.addEventListener("pageDeconEvent", function () {
    console.log("about to deconstruct");
    buildOverlay($("body")[0], true);
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
    var elemOffset = $(domElem).offset();
    var overlay = $('<div class="loadingOverlay"></div>');
    $(overlay).css("top", elemOffset.top);
    $(overlay).css("left", elemOffset.left);

    var rect = domElem.getBoundingClientRect();
    $(overlay).css("width", rect.width);
    $(overlay).css("height", rect.height);

    var text = $('<span class="deconText">Deconstructing...</span>');
    if (fullPage) {
        $(text).addClass("fixedDeconText");
    }

    $(overlay).append(text);

    $("body").append(overlay);
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

    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("deconDataEvent", true, true, deconstructed);
    document.dispatchEvent(evt);
}