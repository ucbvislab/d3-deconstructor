"use strict";
(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type == "initRestyling") {
            chrome.windows.create({url: chrome.extension.getURL('display.html')}, function() {
                console.log("callback on create window");
                console.log(sender);
//                chrome.runtime.sendMessage({type: "restylingWindowCreated"});
            });
            sendResponse({ });
        }
    });

    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendRequest(tab.id, {type: "pageActionClicked"});
        console.log(tab.id);
    });

    chrome.contextMenus.create({
        title: "Deconstruct page",
        contexts:["page"],
        onclick: deconstruct
    });

    function deconstruct(clickData, tab) {
        console.log("should deconstruct now");
        chrome.tabs.sendRequest(tab.id, {type: "pageActionClicked"});
    }

})();
