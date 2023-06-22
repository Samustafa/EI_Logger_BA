import {dataBase} from "@pages/popup/database";
import * as React from "react";
import {useEffect, useState} from "react";
import {ITask} from "@pages/popup/Interfaces";
import {useNavigate} from "react-router-dom";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import Paths from "@pages/popup/Consts/Paths";
import {Snackbar} from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {RightArrowIcon} from "@pages/popup/svg/RightArrowIcon";
import {buttonStyle} from "@pages/popup/Consts/Styles";
import {extractAndSetError} from "@pages/popup/UtilityFunctions";
import {DemographicsButton} from "@pages/popup/Components/SharedComponents/DemographicsButton";
import {DisplayIdButton} from "@pages/popup/Components/SharedComponents/DisplayIdButton";


export function TasksPage() {

    const [iTasks, setITasks] = useState<ITask[]>([]);
    const [open, setOpen] = useState(false);
    const [messageToClipboard, setSnackBarMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);


    useEffect(function fetchTasks() {
        dataBase.getITasks().then((iTasks) => {
            setITasks(iTasks);
        })
            .catch(error => handleErrorFromAsync(error, 'Couldn\'t fetch tasks'));
    }, []);

    function activateSnackBarWithMessage(message: string) {
        setSnackBarMessage(message)
        setOpen(true);
    }

    function handleLogOut() {
        activateSnackBarWithMessage("Not implemented yet");
    }

    function handleUpload() {
        activateSnackBarWithMessage("Not implemented yet");
    }

    function handleErrorFromAsync(caughtError: any, displayMessage: string) {
        extractAndSetError(caughtError, setError);
        activateSnackBarWithMessage(displayMessage + error);
    }

    return (
        <div>
            <h1>Tasks</h1>
            <Tasks iTasks={iTasks} handleErrorFromAsync={handleErrorFromAsync}/>
            <button className={buttonStyle} onClick={() => handleLogOut()}>log Out</button>
            <button className={buttonStyle} onClick={() => handleUpload()}>Upload</button>
            <DemographicsButton/>
            <DisplayIdButton/>
            <Snackbar
                message={messageToClipboard}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
            />
        </div>
    );

}


interface Props {
    iTasks: ITask[];
    handleErrorFromAsync: (caughtError: any, displayMessage: string) => void;
}

export function Tasks({iTasks, handleErrorFromAsync}: Props) {
    const navigate = useNavigate();

    function handleListItemClick(taskId: string, index: number) {

        dataBase.setCurrentTaskId(taskId)
            .then(() => handlePostSet())
            .catch(error => handleErrorFromAsync(error, 'Couldn\'t set current task id'));

        async function handlePostSet() {

            fgLoggingConstants.taskId = taskId;

            if (!iTasks[index].isStarted) {
                dataBase.setTaskStarted(taskId);
                dataBase.logUserExtensionInteraction("STARTED:TASK");
            }

            const shouldGoToPreQuestionnaire = computeShouldGoToPreQuestionnaire(taskId);
            (shouldGoToPreQuestionnaire) ? await goToPreQuestionnaire() : await goToLogger();

            function computeShouldGoToPreQuestionnaire(taskId: string) {
                const iTask = iTasks.find((task) => task.taskId === taskId);

                const hasPreQuestionnaire = (iTask?.iPreQuestions?.length ?? 0) > 0;
                const isPreQuestionsSubmitted = iTask?.isPreQuestionsSubmitted;

                return hasPreQuestionnaire && !isPreQuestionsSubmitted;
            }

            async function goToPreQuestionnaire() {
                dataBase.logUserExtensionInteraction("OPENED:PRE_QUESTIONNAIRE");
                await dataBase.setExtensionState('PRE_QUESTIONNAIRE');
                navigate(Paths.questionnairePage('pre'));
            }

            async function goToLogger() {
                await dataBase.setExtensionState('LOGGER_READY');
                navigate(Paths.loggerPage);
            }

        }
    }

    return (<List component="nav" aria-label="main mailbox folders">
        {iTasks.map((iTask: ITask, index) =>
            (<ListItemButton key={iTask.taskId} disabled={iTask.isCompleted}
                             onClick={() => handleListItemClick(iTask.taskId, index)}>
                <ListItemText primary={iTask.text}/><RightArrowIcon/>
            </ListItemButton>))}
    </List>);
}