var alreadyInjected = false;
var contextElem;

document.addEventListener("contextmenu", function(event) {
    console.log(event);
    contextElem = event.target;
});

if (window === top) {
    chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
        if (req.type == "pageActionClicked") {
            if (!alreadyInjected) {
                // User clicked the page action for the first time, so we inject the main plugin script
                injectJS(chrome.extension.getURL('dist/injected.js'));
                alreadyInjected = true;
                document.addEventListener('deconDataEvent', function(event) {
                    initRestylingInterface(event.detail);
                });
            }
            else {
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent("deconEvent", true, true);
                document.dispatchEvent(evt);
            }
        }
    });
}

function initRestylingInterface(visData) {
    chrome.runtime.sendMessage({type: "initRestyling"}, function() {
        console.log("Initializing restyling interface.");
        console.log(visData);
        setTimeout(function() {
            chrome.runtime.sendMessage({type: "restylingData", data: visData});
        }, 500);
    });
}

function injectJS(url) {
    var script;
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    return document.body.appendChild(script);
}