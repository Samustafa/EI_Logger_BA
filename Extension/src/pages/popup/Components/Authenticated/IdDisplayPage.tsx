import {useNavigate} from "react-router-dom";
import CopyToClipboardButton from "@pages/popup/Components/SharedComponents/CopyToClipboardButton";
import React, {useEffect, useState} from "react";
import {buttonStyle, greenBoxStyle} from "@pages/popup/Constants/Styles";
import {dataBase} from "@pages/popup/Database/database";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
import {Title} from "@pages/popup/Components/SharedComponents/Title";

export function IdDisplayPage() {

    const navigate = useNavigate();

    const [userId, setUserId] = useState<string>("");

    const [doesStudyExist, setDoesStudyExist] = useState<boolean>(false);
    const [hasTasks, setHasTasks] = useState<boolean>(false);

    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    useEffect(function fetchDoesStudyExistAndHasTasks() {
        dataBase.getDoesStudyExist()
            .then(doesStudyExist => setDoesStudyExist(doesStudyExist))
            .catch(error => handleErrorFromAsync(error, setError, setOpen, "IdDisplayPage Couldn't fetch doesStudyExist"));

        dataBase.getHasTasks()
            .then(hasTasks => setHasTasks(hasTasks))
            .catch(error => handleErrorFromAsync(error, setError, setOpen, "IdDisplayPage Couldn't fetch hasTasks"));
    }, [])

    useEffect(function fetchUserId() {
        dataBase.getUserId()
            .then(userId => setUserId(userId))
            .catch(error => handleErrorFromAsync(error, setError, setOpen, "IdDisplayPage Couldn't fetch userId"));
    }, [])

    function handleNext() {

        !doesStudyExist ?
            goToPage('FETCHING_STUDY', navigate)
            : navigateBasedOnTaskExistence();

        function navigateBasedOnTaskExistence() {
            hasTasks ? goToPage('TASKS_PAGE', navigate) : goToPage('LOGGER_READY', navigate);
        }
    }

    return (
        <>
            <Title title={"Your ID"}/>
            <div className={"h-1/4"}></div>
            <div className={greenBoxStyle}>
                <span className="text-green-600 font-bold">{userId ?? "Error while displaying the text"}
                    <CopyToClipboardButton textToCopy={userId ?? ""}/></span>

            </div>
            <br/>
            <p>Please save your ID somewhere safe.</p>
            <p>You&lsquo;ll be able to call your id from the app later at any time.</p>
            <button className={buttonStyle} onClick={() => handleNext()}>Next</button>
            <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
        </>
    );
}