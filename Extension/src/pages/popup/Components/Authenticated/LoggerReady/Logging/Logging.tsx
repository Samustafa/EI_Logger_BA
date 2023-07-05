import React from 'react';
import {PauseButton} from "./PauseButton";
import {connectToBGPort, handleErrorFromAsync, sendMessages} from "@pages/popup/UtilityFunctions";
import {dataBase} from "@pages/popup/database";

interface Props {
    setLogging: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Logging({setLogging, setError, setOpen}: Props) {

    function stopLogging() {
        dataBase.setExtensionState('LOGGER_READY')
            .then(handlePostSet)
            .catch(error => handleErrorFromAsync(error, setError, setOpen));

        function handlePostSet() {
            setLogging(false);

            const port = connectToBGPort("loggingPort")
            sendMessages(port, "STOP_LOGGING");
            port.disconnect();

            dataBase.logUserExtensionInteraction("STOPPED:LOGGING");
        }
    }

    return (<PauseButton onClick={() => stopLogging()}/>);
}