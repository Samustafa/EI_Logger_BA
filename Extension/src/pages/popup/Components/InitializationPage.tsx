import {useNavigate} from "react-router-dom";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import React, {useEffect, useState} from "react";
import {Backdrop, CircularProgress} from "@mui/material";
import {dataBase} from "@pages/popup/database";
import {extractAndSetError, goToPage} from "@pages/popup/UtilityFunctions";
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
            .then(response => goToPage(response, navigate))
            .catch((err) => extractAndSetError(err, setError))
            .finally(() => setIsLoading(false));
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