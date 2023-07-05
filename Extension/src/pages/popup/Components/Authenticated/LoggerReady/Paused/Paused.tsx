import React from 'react';
import {PlayButton} from "./PlayButton";
import {connectToBGPort, handleErrorFromAsync, sendMessages} from "@pages/popup/UtilityFunctions";
import {dataBase} from "@pages/popup/database";

interface Props {
    setLogging: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Paused({setLogging, setError, setOpen}: Props) {

    function startLogging() {
        dataBase.setExtensionState('LOGGING')
            .then(handlePostSet)
            .catch(error => handleErrorFromAsync(error, setError, setOpen));

        function handlePostSet() {
            setLogging(true);

            const port = connectToBGPort("loggingPort")
            sendMessages(port, "START_LOGGING");
            port.disconnect();

            dataBase.logUserExtensionInteraction("STARTED:LOGGING");
        }
    }

    return (<PlayButton onClick={() => startLogging()}/>);
}

