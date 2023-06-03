import {ContentScriptMessage, ContentScriptResponse} from "@pages/popup/Types";
import browser from "webextension-polyfill";


/**
 *start listening in content script
 */
function startListeningInCS() {
    console.log("content script initialized");
    browser.runtime.onMessage.addListener((message: ContentScriptMessage) => handleMessage(message));

    function handleMessage(message: ContentScriptMessage) {
        if (message === "LOG_HTML_OF_SERP") {
            const body = document.body;
            const innerText = body.innerText;
            const innerHTML = body.innerHTML;

            const response: ContentScriptResponse = {
                innerText: innerText,
                innerHTML: innerHTML,
            }
            return Promise.resolve(response);
        }

    }
}

startListeningInCS();

