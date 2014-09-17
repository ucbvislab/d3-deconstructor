"use strict";

var restylingPort;
var alreadyInjected = false;

if (window === top) {
    chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
        if (req.type == "pageActionClicked") {
            if (!alreadyInjected) {
                // User clicked the page action for the first time, so we inject the main plugin script
                injectJS(chrome.extension.getURL('bower_components/underscore/underscore.js'));
                injectJS(chrome.extension.getURL('bower_components/jquery/dist/jquery.js'));
                injectJS(chrome.extension.getURL('bower_components/sylvester/sylvester.js'));
                injectJS(chrome.extension.getURL('bower_components/d3deconstructor/deconstructor.js'));
                injectJS(chrome.extension.getURL('js/injected.js'));
                alreadyInjected = true;
                document.addEventListener('deconDataEvent', function(event) {
                    initRestylingInterface(event.detail);
                });
            }
            else {
                // we have already injected the script -- let's just let it know we want to deconstruct again
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
        }, 1000);
    });
    chrome.runtime.onConnect.addListener(function(port) {
        if (port.name !== "d3decon") {
            console.error("ERROR: Wrong port name.");
        }
        restylingPort = port;
        restylingPort.onMessage.addListener(restylingPortHandler)
    });
}

function restylingPortHandler(message) {
    console.log(message);
    if (message.type === "update") {
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("updateEvent", true, true, message);
        document.dispatchEvent(evt);
    }
    else if (message.type === "create") {
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("createEvent", true, true, message);
        document.dispatchEvent(evt);
    }
    else {
        console.error("Unknown message received.");
    }
}

function injectJS(url) {
    var script;
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    return document.body.appendChild(script);
}

//function injectD3Check() {
//    console.log("injecting d3 checker");
//    injectJS(chrome.extension.getURL('js/d3check.js'));
//}