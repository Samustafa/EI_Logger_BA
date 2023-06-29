import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Backdrop, CircularProgress} from "@mui/material";
import {dataBase} from "@pages/popup/database";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {buttonStyle} from "@pages/popup/Consts/Styles";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";

export function InitializationPage() {
    console.log("InitializationPage")
    const navigate = useNavigate();

    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [retryFlag, setRetryFlag] = useState<boolean>(false);

    useEffect(function assignStates() {
        handleBefore();

        dataBase.getLoggingConstants()
            .then((response) => fgLoggingConstants.initialize(response))
            .then(dataBase.getExtensionState)
            .then(response => goToPage(response, navigate))
            .catch((err) => handleErrorFromAsync(err, setError, setOpen))
            .finally(() => setIsLoading(false));

        function handleBefore() {
            setError("");
            setOpen(false);
        }
    }, [retryFlag]);


    function handleRetry() {
        setError("");
        setOpen(false);
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
            <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
            {error && <button className={buttonStyle} onClick={() => handleRetry()}>Retry</button>}
        </>
    );
}