import {Logging} from "./Logging/Logging";
import {Paused} from "@pages/popup/Components/Authenticated/LoggerReady/Paused/Paused";
import * as React from "react";
import {useEffect, useState} from "react";
import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Consts/Styles";
import {dataBase} from "@pages/popup/database";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import {useLocation, useNavigate} from "react-router-dom";
import Paths from "@pages/popup/Consts/Paths";
import {connectToBGPort, extractAndSetError} from "@pages/popup/UtilityFunctions";
import {Port} from "@pages/popup/Types";
import {ErrorMessage} from "@pages/popup/SharedComponents/ErrorMessage";
import WarningDialog from "@pages/popup/SharedComponents/WarningDialog";
import {DemographicsButton} from "@pages/popup/Components/SharedComponents/DemographicsButton";
import {DisplayIdButton} from "@pages/popup/Components/SharedComponents/DisplayIdButton";

export function LoggerReadyPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLogging, setIsLogging] = useState<boolean>(location.state as boolean);
    const [port, setPort] = useState<Port | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false);
    const [hasTasks, setHasTasks] = useState<boolean>(false);

    const warningText = "Are you sure you want to finish?\n Once finished you won't be able to log anymore";

    useEffect(function fetchHasTasksAndConnectPort() {
        fetchHasTasks();
        connectPort();

        function fetchHasTasks() {
            dataBase.getHasTasks()
                .then(setHasTasks)
                .catch(error => console.error("LoggerReadyPage fetchHasTasks", error));
        }

        function connectPort() {
            const port = connectToBGPort("loggingPort");
            setPort(port);
        }
    }, []);

    function handleFinishedTask() {
        if (hasTasks) {
            dataBase.setTaskCompleted(fgLoggingConstants.taskId);

            dataBase.doesTaskHasQuestionnaire(fgLoggingConstants.taskId, 'post')
                .then((hasPostQuestionnaire) => changeStateAndNavigate(hasPostQuestionnaire))
                .catch((error) => extractAndSetError(error, setError));
        } else {
            navigate(Paths.uploadPage)
        }

        async function changeStateAndNavigate(hasPostQuestionnaire: boolean) {
            (hasPostQuestionnaire) ? await goToPostQuestionnairePage() : await goToTasksPage();

            async function goToPostQuestionnairePage() {
                dataBase.logUserExtensionInteraction('OPENED:POST_QUESTIONNAIRE');
                await dataBase.setExtensionState('POST_QUESTIONNAIRE');
                navigate(Paths.questionnairePage('post'));
            }

            async function goToTasksPage() {
                dataBase.logUserExtensionInteraction('FINISHED:TASK')
                await dataBase.setExtensionState('TASKS_PAGE');
                navigate(Paths.tasksPage);
            }
        }

    }

    function handleBackButton() {
        dataBase.setExtensionState('TASKS_PAGE')
            .then(() => navigate(Paths.tasksPage))
            .catch(error => extractAndSetError(error, setError));

    }

    function renderBackButton(hasTasks: boolean) {
        return (<>{hasTasks &&
            <button className={isLogging ? buttonDisabledStyle : buttonStyle}
                    disabled={isLogging}
                    onClick={() => handleBackButton()}>
                Back
            </button>}</>);
    }

    function demographicsButton(hasTasks: boolean) {
        return (!hasTasks && <><DemographicsButton isDisabled={isLogging}/> <DisplayIdButton
            isDisabled={isLogging}/></>)
    }

    return (
        <div>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {isLogging && <Logging setLogging={setIsLogging} setError={setError} port={port!}/>}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {!isLogging && <Paused setLogging={setIsLogging} setError={setError} port={port!}/>}
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
        </div>
    );
}