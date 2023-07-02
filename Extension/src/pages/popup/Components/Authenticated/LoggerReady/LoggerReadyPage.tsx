import {Logging} from "./Logging/Logging";
import {Paused} from "@pages/popup/Components/Authenticated/LoggerReady/Paused/Paused";
import * as React from "react";
import {useEffect, useState} from "react";
import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Consts/Styles";
import {dataBase} from "@pages/popup/database";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import {useLocation, useNavigate} from "react-router-dom";
import {connectToBGPort, goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {Port} from "@pages/popup/Types";
import {ErrorMessage} from "@pages/popup/SharedComponents/ErrorMessage";
import WarningDialog from "@pages/popup/SharedComponents/WarningDialog";
import {DemographicsButton} from "@pages/popup/Components/SharedComponents/DemographicsButton";
import {DisplayIdButton} from "@pages/popup/Components/SharedComponents/DisplayIdButton";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
import {Title} from "@pages/popup/Components/SharedComponents/Title";

export function LoggerReadyPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLogging, setIsLogging] = useState<boolean>(location.state as boolean);
    const [port, setPort] = useState<Port | null>(null);
    const [error, setError] = useState<string>('');
    const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false);
    const [hasTasks, setHasTasks] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const warningText = "Are you sure you want to finish?\n Once finished you won't be able to log anymore";

    useEffect(function fetchHasTasksAndConnectPort() {
        fetchHasTasks();
        connectPort();

        function fetchHasTasks() {
            dataBase.getHasTasks()
                .then(setHasTasks)
                .catch(error => handleErrorFromAsync(error, setError, setOpen, "LoggerReadyPage fetchHasTasks"));
        }

        function connectPort() {
            const port = connectToBGPort("loggingPort");
            setPort(port);
        }
    }, []);

    function handleFinishedTask() {
        if (hasTasks) {
            dataBase.doesTaskHasQuestionnaire(fgLoggingConstants.taskId, 'post')
                .then((hasPostQuestionnaire) => changeStateAndNavigate(hasPostQuestionnaire))
                .catch((error) => handleErrorFromAsync(error, setError, setOpen));
        } else {
            goToPage('UPLOAD_PAGE', navigate);
        }

        async function changeStateAndNavigate(hasPostQuestionnaire: boolean) {
            (hasPostQuestionnaire) ? goToPostQuestionnairePage() : goToTasksPage();

            function goToPostQuestionnairePage() {
                dataBase.logUserExtensionInteraction('OPENED:POST_QUESTIONNAIRE');
                goToPage('POST_QUESTIONNAIRE', navigate);
            }

            function goToTasksPage() {
                dataBase.setTaskCompleted(fgLoggingConstants.taskId);
                dataBase.logUserExtensionInteraction('FINISHED:TASK');

                goToPage('TASKS_PAGE', navigate);
            }
        }

    }

    function renderBackButton(hasTasks: boolean) {
        return (<>{hasTasks &&
            <button className={isLogging ? buttonDisabledStyle : buttonStyle}
                    disabled={isLogging}
                    onClick={() => goToPage('TASKS_PAGE', navigate)}>
                Back
            </button>}</>);
    }

    function demographicsButton(hasTasks: boolean) {
        return (!hasTasks && <><DemographicsButton isDisabled={isLogging}/> <DisplayIdButton
            isDisabled={isLogging}/></>)
    }

    return <>
    {isLogging ? <Title title={"Logging"}/> : <Title title={"Logger is offline"}/>}

        <div className={"h-1/4"}></div>
        <div>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {isLogging && <Logging setLogging={setIsLogging} setError={setError} setOpen={setOpen} port={port!}/>}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {!isLogging && <Paused setLogging={setIsLogging} setOpen={setOpen} setError={setError} port={port!}/>}
            <div>
                {renderBackButton(hasTasks)}
                <button className={isLogging ? buttonDisabledStyle : buttonStyle}
                        disabled={isLogging}
                        onClick={() => setOpenWarningDialog(true)}>
                    Finished Task
                </button>
                {demographicsButton(hasTasks)}

                <ErrorMessage error={error}/>
            </div>
            <WarningDialog warningText={warningText} open={openWarningDialog} setOpen={setOpenWarningDialog}
                           acceptFunction={handleFinishedTask}/>
            <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
        </div>
    </>

}