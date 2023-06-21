import {useNavigate} from "react-router-dom";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import React, {useEffect, useState} from "react";
import {Backdrop, CircularProgress} from "@mui/material";
import {ExtensionState} from "@pages/popup/Types";
import {dataBase} from "@pages/popup/database";
import Paths from "@pages/popup/Consts/Paths";
import {extractAndSetError} from "@pages/popup/UtilityFunctions";
import {ErrorMessage} from "@pages/popup/SharedComponents/ErrorMessage";
import {buttonStyle} from "@pages/popup/Consts/Styles";

export function InitializationPage() {
    console.log("InitializationPage")
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [retryFlag, setRetryFlag] = useState<boolean>(false);

    useEffect(function assignStates() {
        dataBase.getLoggingConstants()
            .then((response) => fgLoggingConstants.initialize(response))
            .then(dataBase.getExtensionState)
            .then(navigateBasedOnExtensionState)
            .catch((err) => extractAndSetError(err, setError))
            .finally(() => setIsLoading(false));

        function navigateBasedOnExtensionState(response: ExtensionState | undefined) {
            switch (response) {
                case "NOT_AUTHENTICATED":
                    navigate(Paths.landingPage);
                    break;
                case "DISPLAYING_ID":
                    navigate(Paths.idDisplayPage);
                    break;
                case "DEMOGRAPHICS":
                    navigate(Paths.demographicsPage);
                    break;
                case "TASKS_PAGE":
                    navigate(Paths.tasksPage);
                    break;
                case "PRE_QUESTIONNAIRE":
                    navigate(Paths.questionnairePage('pre'));
                    break;
                case "LOGGER_READY":
                    navigate(Paths.loggerPage);
                    break;
                case "LOGGING":
                    navigate(Paths.loggerPage, {state: true});
                    break;
                case "POST_QUESTIONNAIRE":
                    navigate(Paths.questionnairePage('post'));
                    break;
                default:
                    navigate(Paths.landingPage);
            }
        }

    }, [retryFlag]);


    function handleRetry() {
        setError("");
        setIsLoading(true);
        setRetryFlag(!retryFlag);
    }

    return (
        <>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            {error && <ErrorMessage error={error}/>}
            {error && <button className={buttonStyle} onClick={() => handleRetry()}>Retry</button>}
        </>
    );
}