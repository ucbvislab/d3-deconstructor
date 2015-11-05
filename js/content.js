doInject();

if (window === top) {
    chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
        console.log(req);
        if (req.type == "pageActionClicked") {
            var evt = new CustomEvent("pageDeconEvent", {type: "pageDeconEvent"});
            // evt.initCustomEvent("pageDeconEvent", true, true);
            document.dispatchEvent(evt);
        }
        else if (req.type == "deconstructVis") {
            var evt = document.createEvent("CustomEvent");
            var evt = new CustomEvent("nodeDeconEvent", {type: "nodeDeconEvent"});
            console.log("sending node decon event");
            document.dispatchEvent(evt);
        }
    });
}

function initRestylingInterface(visData) {
    chrome.runtime.sendMessage({type: "initView"}, function() {
        chrome.runtime.sendMessage({
                type:"loadingInit",
                data: {}
            });

        setTimeout(function() {
            chrome.runtime.sendMessage({type: "restylingData", data: visData});
            jQuery(".loadingOverlay, .loadingOverlayFullPage").remove();
        }, 500);
    });
}

function doInject() {
    var script;
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = chrome.extension.getURL('dist/injected.js');
    document.addEventListener('deconDataEvent', function(event) {
        initRestylingInterface(event.detail);
    });
    return document.body.appendChild(script);
}