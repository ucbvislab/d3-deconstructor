var VisDeconstruct = require('d3deconstructor');

pageDeconstruct();

document.addEventListener("deconEvent", function () {
    console.log("about to deconstruct");
    pageDeconstruct();
});

/**
 * Accepts a top level SVG node and deconstructs it by extracting data, marks, and the
 * mappings between them.
 * @param svgNode - Top level SVG node of a D3 visualization.
 */
function visDeconstruct(svgNode) {
    var deconstructed = VisDeconstruct.deconstruct(svgNode);

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
    var deconstructed = VisDeconstruct.pageDeconstruct();

    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("deconDataEvent", true, true, deconstructed);
    document.dispatchEvent(evt);
}