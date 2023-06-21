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


export function TasksPage() {
    const navigate = useNavigate();

    const [iTasks, setITasks] = useState<ITask[]>([]);
    const [open, setOpen] = useState(false);
    const [messageToClipboard, setMessageToClipboard] = useState<string>("");
    const [hasDemographics, setHasDemographics] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(function fetchTasks() {
        dataBase.getITasks().then((iTasks) => {
            setITasks(iTasks);
        })
            .catch(error => handleError(error, 'Couldn\'t fetch tasks'));
    }, []);

    useEffect(function checkIfShouldOpenDemographics() {
        dataBase.getHasDemographics()
            .then(hasDemographics => setHasDemographics(hasDemographics))
            .catch(error => handleError(error, 'Couldn\'t fetch hasDemographics'));
    }, []);

    function goToDemographics() {
        dataBase.setExtensionState('DEMOGRAPHICS');
        navigate(Paths.demographicsPage);
    }

    function handleLogOut() {
        setMessageToClipboard("Not implemented yet");
        setOpen(true);
    }

    function handleUpload() {
        setMessageToClipboard("Not implemented yet");
        setOpen(true);
    }

    function handleError(caughtError: any, displayMessage: string) {
        extractAndSetError(caughtError, setError);
        setMessageToClipboard(displayMessage + error);
    }

    function renderDemographicsButton(hasDemographics: boolean) {
        return (<>{hasDemographics &&
            <button className={buttonStyle} onClick={() => goToDemographics()}>Edit Demographics</button>}</>);
    }

    return (
        <div>
            <h1>Tasks</h1>
            <Tasks iTasks={iTasks}/>
            <button className={buttonStyle} onClick={() => handleLogOut()}>log Out</button>
            <button className={buttonStyle} onClick={() => handleUpload()}>Upload</button>
            {renderDemographicsButton(hasDemographics)}
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
}

export function Tasks({iTasks}: Props) {
    const navigate = useNavigate();

    async function handleListItemClick(taskId: string, index: number) {
        fgLoggingConstants.taskId = taskId;
        await dataBase.setCurrentTaskId(taskId);

        if (!iTasks[index].isStarted) {
            dataBase.setTaskStarted(taskId);
            dataBase.logUserExtensionInteraction("STARTED:TASK");
        }

        const shouldGoToPreQuestionnaire = computeShouldGoToPreQuestionnaire(taskId);
        (shouldGoToPreQuestionnaire) ? goToPreQuestionnaire() : goToLogger();

        function computeShouldGoToPreQuestionnaire(taskId: string) {
            const iTask = iTasks.find((task) => task.taskId === taskId);

            const hasPreQuestionnaire = (iTask?.iPreQuestions?.length ?? 0) > 0;
            const isPreQuestionsSubmitted = iTask?.isPreQuestionsSubmitted;

            return hasPreQuestionnaire && !isPreQuestionsSubmitted;
        }

        function goToPreQuestionnaire() {
            dataBase.logUserExtensionInteraction("OPENED:PRE_QUESTIONNAIRE");
            dataBase.setExtensionState('PRE_QUESTIONNAIRE');
            navigate(Paths.questionnairePage('pre'));
        }

        function goToLogger() {
            dataBase.setExtensionState('LOGGER_READY');
            navigate(Paths.loggerPage);
        }
    }

    return (
        <>
            <List component="nav" aria-label="main mailbox folders">
                {iTasks.map((iTask: ITask, index) =>
                    (<ListItemButton key={iTask.taskId} disabled={iTask.isCompleted}
                                     onClick={() => handleListItemClick(iTask.taskId, index)}>
                        <ListItemText primary={iTask.text}/><RightArrowIcon/>
                    </ListItemButton>))}
            </List>


        </>
    );
}