import React from 'react';
import {createRoot} from 'react-dom/client';
import '@assets/styles/tailwind.css';
import '@pages/popup/index.css';
import {MemoryRouter as Router} from 'react-router-dom';
import Popup from "@pages/popup/Popup";

function init() {
    const rootContainer = document.querySelector("#__root");
    if (!rootContainer) throw new Error("Can't find Popup root element");
    const root = createRoot(rootContainer);
    root.render(<Router><Popup/></Router>);
}

init();
