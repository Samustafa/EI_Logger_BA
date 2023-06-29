import {useNavigate} from "react-router-dom";
import CopyToClipboardButton from "@pages/popup/SharedComponents/CopyToClipboardButton";
import React, {useEffect, useState} from "react";
import {buttonStyle} from "@pages/popup/Consts/Styles";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import {dataBase} from "@pages/popup/database";
import {goToPage} from "@pages/popup/UtilityFunctions";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";

export function IdDisplayPage() {

    const id = fgLoggingConstants.userId;
    const navigate = useNavigate();

    const [doesStudyExist, setDoesStudyExist] = useState<boolean>(false);
    const [hasTasks, setHasTasks] = useState<boolean>(false);

    const [error, setError] = useState<string>(!id ? "Error while displaying the text" : "");
    const [open, setOpen] = useState<boolean>(false);

    useEffect(function fetchDoesStudyExistAndHasTasks() {
        dataBase.getDoesStudyExist()
            .then(doesStudyExist => setDoesStudyExist(doesStudyExist))
            .catch(error => console.error("IdDisplayPage Couldn't fetch doesStudyExist", error));

        dataBase.getHasTasks()
            .then(hasTasks => setHasTasks(hasTasks))
            .catch(error => console.error("IdDisplayPage Couldn't fetch hasTasks", error));
    }, [])

    function handleNext() {
        !doesStudyExist ? goToPage('FETCHING_STUDY', navigate)
            : hasTasks ? goToPage('TASKS_PAGE', navigate) : goToPage('LOGGER_READY', navigate)
    }

    return (
        <>
            <p>Registration Successful!</p>
            <br/>
            <div className={"bg-green-300 border-double border-4 border-sky-500 grid grid-rows-1 grid-flow-col gap-4"}>
                <p className="text-green-600 font-bold">{id ?? "Error while displaying the text"}</p>
                <CopyToClipboardButton textToCopy={id ?? ""}/>
            </div>
            <br/>
            <p>Please save your ID somewhere safe and don&lsquo;t share it with any person, even the people responsible
                for
                the study!</p>
            <p>You will need your ID, if you decide to log-in from another device!</p>
            <p>You&lsquo;ll be able to call your id from the app</p>
            <button className={buttonStyle} onClick={() => handleNext()}>Next</button>
            <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
        </>
    );
}