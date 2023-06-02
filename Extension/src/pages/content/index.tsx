import {Port, PortNameCS} from "@pages/popup/Types";
import browser from "webextension-polyfill";


/**
 *start listening in content script
 */
function startListeningInCS() {
    browser.runtime.onConnect.addListener(connectCSPort);
    console.log("content script initialized");
}

/**
 * accept connections to content script ports
 * @param port
 */
function connectCSPort(port: Port) {
    const portName = port.name as PortNameCS;
    console.log(`service worker connected to port ${portName}`);

    switch (portName) {
        case 'logHTML':
            port.onMessage.addListener((message) => {
                console.log("loggingPort message received", message)
            })
            break;
    }
}

startListeningInCS();

