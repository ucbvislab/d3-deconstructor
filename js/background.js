"use strict";
(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type == "initRestyling") {
            chrome.windows.create({url: chrome.extension.getURL('display.html')});
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
        chrome.tabs.sendRequest(tab.id, {type: "pageActionClicked"});
    }

})();
