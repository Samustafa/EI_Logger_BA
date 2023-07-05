import React, {useEffect, useState} from "react";
import {getStudy} from "@pages/popup/ServerAPI";
import {Backdrop, CircularProgress} from "@mui/material";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {useNavigate} from "react-router-dom";
import {dataBase} from "@pages/popup/Database/database";
import {
    IMultipleChoiceQuestion,
    IQuestion,
    IRangeQuestion,
    IStudy,
    ITask,
    ITextQuestion
} from "@pages/popup/Database/DatabaseInterfaces";
import {Study} from "@pages/popup/model/Study";
import {Task} from "@pages/popup/model/Task";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";

export function FetchingStudyData() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [retryFlag, setRetryFlag] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();


    useEffect(function fetchStudy() {
        setLoading(true);

        getStudy()
            .then(saveStudyAndNavigate)
            .catch(error => handleErrorFromAsync(error, setError, setOpen))
            .finally(() => setLoading(false));

        async function saveStudyAndNavigate(study: Study) {
            await saveStudy(study).catch(error => handleErrorFromAsync(error, setError, setOpen));

            const hasTasks = study.tasks.length > 0;
            const hasDemographics = await dataBase.getHasDemographics();
            transitionToNextPage(hasDemographics, hasTasks);

            async function saveStudy(study: Study) {
                await saveStudyInDatabase(new Study(study.studyId, study.name, study.hasDemographics, study.tasks))
                    .catch(error => handleErrorFromAsync(error, setError, setOpen));

                async function saveStudyInDatabase(studyData: Study) {
                    const {
                        study,
                        tasks,
                        multipleChoiceQuestions,
                        textQuestions,
                        rangeQuestions
                    } = extractStudyData(studyData);

                    await dataBase.saveStudyInfo(study, tasks, multipleChoiceQuestions, textQuestions, rangeQuestions)
                        .catch(error => handleErrorFromAsync(error, setError, setOpen));

                    function extractStudyData(studyData: Study) {
                        const study: IStudy = {
                            studyId: studyData.studyId,
                            name: studyData.name,
                            hasDemographics: studyData.hasDemographics,
                        }

                        const tasks = studyData.tasks.map((task: Task): ITask => ({
                            taskId: task.taskId,
                            text: task.text,
                            isStarted: false,
                            isCompleted: false,
                            isPreQuestionsSubmitted: false,
                            isPostQuestionsSubmitted: false,
                            iPreQuestions: task.getIPreQuestions(),
                            iPostQuestions: task.getIPostQuestions(),
                        }))

                        const questions: IQuestion[] = studyData.getIQuestions();
                        const multipleChoiceQuestions = questions.filter(question => question.type === "MultipleChoiceQuestion") as IMultipleChoiceQuestion[]
                        const textQuestions = questions.filter(question => question.type === "TextQuestion") as ITextQuestion[]
                        const rangeQuestions = questions.filter(question => question.type === "RangeQuestion") as IRangeQuestion[]

                        return {study, tasks, multipleChoiceQuestions, textQuestions, rangeQuestions}
                    }
                }
            }

            function transitionToNextPage(hasDemographics: boolean, hasTasks: boolean) {
                hasDemographics ?
                    goToPage('DEMOGRAPHICS', navigate)
                    : navigateBasedOnTaskExistence();

                function navigateBasedOnTaskExistence() {
                    hasTasks ? goToPage('TASKS_PAGE', navigate) : goToPage('LOGGER_READY', navigate);
                }
            }
        }

    }, [retryFlag]);

    function retry() {
        setRetryFlag(!retryFlag)
    }

    return (
        <>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
            {error && <button onClick={retry}>Retry</button>}
        </>
    );
}