import React from 'react';
import {PlayButton} from "./PlayButton";
import {display, extractAndSetError, sendMessages} from "@pages/popup/UtilityFunctions";
import {Port} from "@pages/popup/Types";
import {dataBase} from "@pages/popup/database";

interface Props {
    port: Port;
    setLogging: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function Paused({setLogging, port, setError}: Props) {

    function startLogging() {

        dataBase.setExtensionState('LOGGING')
            .then(handlePostSet)
            .catch(error => extractAndSetError(error, setError));

        function handlePostSet() {
            setLogging(true);
            sendMessages(port, "START_LOGGING");
            dataBase.logUserExtensionInteraction("STARTED:LOGGING");
        }

    }

    return (
        <>
            {display("logger is offline")}
            <PlayButton onClick={() => startLogging()}/>
        </>
    );
}

