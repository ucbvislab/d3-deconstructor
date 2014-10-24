"use strict";
(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type == "initView") {
            chrome.windows.create({url: chrome.extension.getURL('display.html')});
            sendResponse({ });
        }
    });

    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendRequest(tab.id, {type: "pageActionClicked"});
        console.log(tab.id);
    });

    chrome.contextMenus.create({
        title: "Deconstruct visualization",
        contexts:["page"],
        onclick: deconstruct
    });

    function deconstruct(tab) {
        chrome.tabs.sendRequest(tab.id, {type: "deconstructVis"});
    }

})();
