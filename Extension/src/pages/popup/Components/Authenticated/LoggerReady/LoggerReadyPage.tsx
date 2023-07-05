import {Logging} from "./Logging/Logging";
import {Paused} from "@pages/popup/Components/Authenticated/LoggerReady/Paused/Paused";
import * as React from "react";
import {useEffect, useState} from "react";
import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Consts/Styles";
import {dataBase} from "@pages/popup/database";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import {useLocation, useNavigate} from "react-router-dom";
import WarningDialog from "@pages/popup/Components/SharedComponents/WarningDialog";
import {DemographicsButton} from "@pages/popup/Components/SharedComponents/DemographicsButton";
import {DisplayIdButton} from "@pages/popup/Components/SharedComponents/DisplayIdButton";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
import {Title} from "@pages/popup/Components/SharedComponents/Title";
import {InformationBox} from "@pages/popup/Components/SharedComponents/InformationBox";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";

export function LoggerReadyPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLogging, setIsLogging] = useState<boolean>(location.state as boolean);
    const [error, setError] = useState<string>('');
    const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false);
    const [hasTasks, setHasTasks] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const warningText = "Are you sure you want to finish the task?\n Once finished you won't be able to work on this task anymore";
    const [taskText, setTaskText] = useState<string>('');

    useEffect(function fetchHasTasks() {
        fetchHasTasks();

        function fetchHasTasks() {
            dataBase.getHasTasks()
                .then(setHasTasks)
                .catch(error => handleErrorFromAsync(error, setError, setOpen, "LoggerReadyPage fetchHasTasks"));
        }
    }, []);

    useEffect(function fetchTaskText() {
        dataBase.getTaskText(fgLoggingConstants.taskId)
            .then((taskText) => setTaskText(taskText))
            .catch(error => handleErrorFromAsync(error, setError, setOpen, "Couldn't fetch task text"));
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
        <InformationBox informationText={taskText}/>
        <div className={"p-2"}>
            {isLogging && <Logging setLogging={setIsLogging} setError={setError} setOpen={setOpen}/>}
            {!isLogging && <Paused setLogging={setIsLogging} setOpen={setOpen} setError={setError}/>}

            <div>
                {renderBackButton(hasTasks)}
                <button className={isLogging ? buttonDisabledStyle : buttonStyle}
                        disabled={isLogging}
                        onClick={() => setOpenWarningDialog(true)}>
                    Finished Task
                </button>
                {demographicsButton(hasTasks)}
            </div>

            <WarningDialog warningText={warningText} open={openWarningDialog} setOpen={setOpenWarningDialog}
                           acceptFunction={handleFinishedTask}/>
            <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
        </div>
    </>

}