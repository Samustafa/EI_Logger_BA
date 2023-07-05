import React, {FormEvent, useState} from "react";
import {labelStyle} from "@pages/popup/Constants/Styles";
import {useNavigate} from "react-router-dom";
import {LoadingButton} from "@pages/popup/Components/SharedComponents/LoadingButton";
import {login, registerUser} from "@pages/popup/ServerAPI";
import {dataBase} from "@pages/popup/Database/database";
import {Input36Component} from "@pages/popup/Components/SharedComponents/Input36Component";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {fgLoggingConstants} from "@pages/popup/Constants/FgLoggingConstants";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
//99746344-7382-4d7c-9e60-6ed3a3cef427
export default function LandingPage() {

    const [userId, setUserId] = useState<string>("");
    const [loginError, setLoginError] = useState<string>('');


    const [registrationCode, setRegistrationCode] = useState<string>("");
    const [registrationError, setRegistrationError] = useState<string>('');

    const [isValidating, setIsValidating] = useState<boolean>(false);

    const [open, setOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const registrationForm = "registrationForm";
    const loginForm = "loginForm";

    function disableButtons() {
        setIsValidating(true);
    }

    function enableButtons() {
        setIsValidating(false);
    }

    function clearErrors() {
        setRegistrationError('');
        setLoginError('');
    }

    function handleRegister(event: FormEvent<HTMLFormElement>) {
        handlePreRegister();

        registerUser(registrationCode)
            .then(userId => handlePostRegister(userId))
            .catch(error => handleErrorFromAsync(error, setRegistrationError, setOpen))
            .finally(() => enableButtons());

        function handlePreRegister() {
            event.preventDefault();
            clearErrors();
            disableButtons();
            setUserId("");
            setOpen(false);
        }

        function handlePostRegister(userId: string) {
            dataBase.setExtensionState('DISPLAYING_ID')
                .then(saveStateAndNavigate)
                .catch(error => handleErrorFromAsync(error, setRegistrationError, setOpen));

            function saveStateAndNavigate() {
                dataBase.setUserId(userId)
                dataBase.logUserExtensionInteraction("SIGNED:UP");
                fgLoggingConstants.userId = userId;
                goToPage('DISPLAYING_ID', navigate);
            }
        }
    }

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        handlePreLogIn();

        login(userId)
            .then(() => handlePostLogIn())
            .catch((error) => handleErrorFromAsync(error, setLoginError, setOpen))
            .finally(() => enableButtons());

        function handlePreLogIn() {
            event.preventDefault();
            clearErrors();
            disableButtons();
            setRegistrationCode("");
            setOpen(false);
        }

        function handlePostLogIn() {
            dataBase.setUserId(userId);
            dataBase.logUserExtensionInteraction("SIGNED:IN");
            fgLoggingConstants.userId = userId;
            goToPage('FETCHING_STUDY', navigate);
        }
    }

    return (
        <>
            {/*<form id={loginForm} onSubmit={handleLogin}>*/}
            {/*    <label className={input36Style} htmlFor={loginForm}>User ID:</label>*/}
            {/*    <Input36Component isError={!!loginError}*/}
            {/*                      value={userId}*/}
            {/*                      changeValue={setUserId}*/}
            {/*                      isDisabled={isValidating}*/}
            {/*                      name={loginForm}/>*/}
            {/*    <LoadingButton text={'Login'} loadingText={'Validating...'} isLoading={isValidating} type={'submit'}/>*/}
            {/*</form>*/}

            <form id={registrationForm} onSubmit={handleRegister}>
                <label className={labelStyle} htmlFor={registrationForm}>Registration Code</label>
                <Input36Component isError={!!registrationError}
                                  value={registrationCode}
                                  changeValue={setRegistrationCode}
                                  isDisabled={isValidating}
                                  name={registrationForm}/>
                <LoadingButton text={'Register'} loadingText={'Validating...'} isLoading={isValidating}
                               type={'submit'}/>
            </form>

            <Notification notificationType={'error'} message={loginError + registrationError} open={open}
                          setOpen={setOpen}/>
        </>
    );
}