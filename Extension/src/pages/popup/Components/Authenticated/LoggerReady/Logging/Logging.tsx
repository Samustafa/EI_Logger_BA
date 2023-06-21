import React from 'react';
import {PauseButton} from "./PauseButton";
import {display, extractAndSetError, sendMessages} from "@pages/popup/UtilityFunctions";
import {Port} from "@pages/popup/Types";
import {dataBase} from "@pages/popup/database";

interface Props {
    port: Port;
    setLogging: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function Logging({setLogging, port, setError}: Props) {

    function stopLogging() {
        dataBase.setExtensionState('LOGGER_READY')
            .then(handlePostSet)
            .catch(error => extractAndSetError(error, setError));

        function handlePostSet() {
            setLogging(false);
            sendMessages(port, "STOP_LOGGING");
            dataBase.logUserExtensionInteraction("STOPPED:LOGGING");
        }
    }

    return (
        <div>
            {display("logger is online")}
            <PauseButton onClick={() => stopLogging()}/>
        </div>
    );
}