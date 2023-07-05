import {dataBase} from "@pages/popup/database";
import * as React from "react";
import {useEffect, useState} from "react";
import {ITask} from "@pages/popup/Interfaces";
import {useNavigate} from "react-router-dom";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {RightArrowIcon} from "@pages/popup/svg/RightArrowIcon";
import {buttonStyle} from "@pages/popup/Consts/Styles";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {DemographicsButton} from "@pages/popup/Components/SharedComponents/DemographicsButton";
import {DisplayIdButton} from "@pages/popup/Components/SharedComponents/DisplayIdButton";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
import {Title} from "@pages/popup/Components/SharedComponents/Title";
import {InformationBox} from "@pages/popup/Components/SharedComponents/InformationBox";


export function TasksPage() {

    const [iTasks, setITasks] = useState<ITask[]>([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(function fetchTasks() {
        dataBase.getITasks().then((iTasks) => setITasks(iTasks))
            .catch(error => handleErrorFromAsync(error, setError, setOpen, 'Couldn\'t fetch tasks'));
    }, []);

    function handleUpload() {
        setError("Not implemented yet");
        setOpen(true);
    }

    return (
        <>
            <Title title={"Tasks"}/>
            <InformationBox
                informationText={"Choose a task to solve. After starting a task don't forget to start the Logger inside the task."}/>
            <Tasks iTasks={iTasks} setError={setError} setOpen={setOpen}/>
            <button className={buttonStyle} onClick={() => handleUpload()}>Upload</button>
            <DemographicsButton/>
            <DisplayIdButton/>
            <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
        </>
    );

}


interface Props {
    iTasks: ITask[];
    setError: React.Dispatch<React.SetStateAction<string>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Tasks({iTasks, setError, setOpen}: Props) {
    const navigate = useNavigate();

    function handleListItemClick(taskId: string, index: number) {

        dataBase.setCurrentTaskId(taskId)
            .then(() => handlePostSet())
            .catch(error => handleErrorFromAsync(error, setError, setOpen, 'Couldn\'t set current task id'));

        async function handlePostSet() {

            fgLoggingConstants.taskId = taskId;

            if (!iTasks[index].isStarted) {
                dataBase.setTaskStarted(taskId);
                dataBase.logUserExtensionInteraction("STARTED:TASK");
            }

            const shouldGoToPreQuestionnaire = computeShouldGoToPreQuestionnaire(taskId);
            (shouldGoToPreQuestionnaire) ? goToPreQuestionnaire() : goToPage('LOGGER_READY', navigate);

            function computeShouldGoToPreQuestionnaire(taskId: string) {
                const iTask = iTasks.find((task) => task.taskId === taskId);

                const hasPreQuestionnaire = (iTask?.iPreQuestions?.length ?? 0) > 0;
                const isPreQuestionsSubmitted = iTask?.isPreQuestionsSubmitted;

                return hasPreQuestionnaire && !isPreQuestionsSubmitted;
            }

            function goToPreQuestionnaire() {
                dataBase.logUserExtensionInteraction("OPENED:PRE_QUESTIONNAIRE");
                goToPage('PRE_QUESTIONNAIRE', navigate);
            }
        }
    }

    return (<List component="nav" aria-label="main mailbox folders">
        {iTasks.map((iTask: ITask, index) =>
            (<ListItemButton className={"flex items-center"} key={iTask.taskId}
                             disabled={iTask.isCompleted}
                             onClick={() => handleListItemClick(iTask.taskId, index)}>

                <div className={"font-bold m-2 text-l"}>{index + 1})</div>
                <ListItemText primary={iTask.text}/>
                <div className={"p-2"}><RightArrowIcon/></div>

            </ListItemButton>))}
    </List>);
}