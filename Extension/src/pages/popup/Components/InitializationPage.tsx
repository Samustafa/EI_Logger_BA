import {useNavigate} from "react-router-dom";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import React, {useEffect, useState} from "react";
import {Backdrop, CircularProgress} from "@mui/material";
import {dataBase} from "@pages/popup/database";
import {extractAndSetError, goToPage} from "@pages/popup/UtilityFunctions";
import {ErrorMessage} from "@pages/popup/SharedComponents/ErrorMessage";
import {buttonStyle} from "@pages/popup/Consts/Styles";

/**
 * Objective:
 * The InitializationPage function is responsible for initializing the extension by fetching logging constants and extension state from the database, and redirecting the user to the appropriate page based on the extension state. It also handles displaying loading and error messages, and allows the user to retry if an error occurs.
 *
 * Flow:
 * 1. The function initializes state variables for error, loading, and retry flag.
 * 2. It uses the useEffect hook to fetch logging constants and extension state from the database, and redirect the user to the appropriate page based on the extension state.
 * 3. If an error occurs, it calls the extractAndSetError function to extract and display the error message.
 * 4. Finally, it displays loading and error messages, and allows the user to retry if an error occurs.
 *
 * Outputs:
 * - JSX elements for displaying loading and error messages, and a retry button if an error occurs.
 *
 * Additional aspects:
 * - The function uses the useNavigate hook from the react-router-dom library to navigate to different pages.
 * - It uses the useState and useEffect hooks to manage component state and lifecycle.
 * - It imports and uses various functions and constants from other files, such as extractAndSetError, fgLoggingConstants, and Paths.
 */

export function InitializationPage() {
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