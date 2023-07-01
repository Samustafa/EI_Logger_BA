import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {dataBase} from "@pages/popup/database";
import {IAnswer, IQuestionAnswer} from "@pages/popup/Interfaces";
import {LoadingButton} from "@pages/popup/SharedComponents/LoadingButton";
import {addOrUpdateAnswers, goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Consts/Styles";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import {Question} from "@pages/popup/model/question/Question";
import {MultipleChoiceQuestion} from "@pages/popup/model/question/MultipleChoiceQuestion";
import {TextQuestion} from "@pages/popup/model/question/TextQuestion";
import {RangeQuestion} from "@pages/popup/model/question/RangeQuestion";
import {
    MultipleChoiceQuestionComponent
} from "@pages/popup/Components/Authenticated/Questions/QuestionType/MultipleChoiceQuestionComponent";
import {
    TextQuestionComponent
} from "@pages/popup/Components/Authenticated/Questions/QuestionType/TextQuestionComponent";
import {
    RangeQuestionComponent
} from "@pages/popup/Components/Authenticated/Questions/QuestionType/RangeQuestionComponent";
import {AnswersContext} from "@pages/popup/Contexts";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";


export function QuestionnairePage() {
    const navigate = useNavigate();
    const {questionnaireType} = useParams<string>();
    const taskId = fgLoggingConstants.taskId;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<IQuestionAnswer[]>([]);

    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true);

    const [error, setError] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(function fetchQuestionsThenSetInitialAnswers() {
        dataBase.getQuestionnaire(taskId, questionnaireType)
            .then((questions) => {
                setQuestions(questions);
                setInitialAnswers(questions);
            })
            .catch((error) => handleErrorFromAsync(error, setError, setOpen, "Error fetching questions"));

        function setInitialAnswers(questions: Question[]) {
            questions?.forEach(question => {
                if (question instanceof TextQuestion) {
                    updateAnswers(question.questionId, "");
                } else if (question instanceof MultipleChoiceQuestion) {
                    updateAnswers(question.questionId, question.choices[0]);
                } else if (question instanceof RangeQuestion) {
                    updateAnswers(question.questionId, '0');
                }
            })

        }

    }, [taskId])

    function mapIQuestionAnswerToIAnswer(iQuestionAnswer: IQuestionAnswer, studyId: string, userId: string): IAnswer {
        return {
            questionId: iQuestionAnswer.questionId,
            taskId: taskId,
            answer: iQuestionAnswer.answer,
            studyId: studyId,
            userId: userId
        }
    }

    function handleSubmit() {
        setIsValidating(true);
        setError("");
        setIsSuccess(false);

        const studyId = fgLoggingConstants.studyId;
        const userId = fgLoggingConstants.userId;
        const iAnswers = answers.map(answer => mapIQuestionAnswerToIAnswer(answer, studyId, userId));
        dataBase.submitQuestionnaire(taskId, iAnswers, questionnaireType)
            .then(() => dataBase.setQuestionnaireSubmitted(taskId, questionnaireType))
            .then(handlePostSubmit)
            .catch((error) => handleErrorFromAsync(error, setError, setOpen, "Error submitting questionnaire"))
            .finally(() => setIsValidating(false));

        function handlePostSubmit() {
            setIsSuccess(true);
            setIsNextDisabled(false);
        }
    }

    function handleBack() {
        (questionnaireType === 'pre') ? goToPage('TASKS_PAGE', navigate) : goToPage('LOGGER_READY', navigate);
    }

    function handleNext() {

        (questionnaireType === 'pre') ? handleGoToLoggerPage() : handleGoToTasksPage();

        function handleGoToLoggerPage() {
            dataBase.setExtensionState('LOGGER_READY')
                .then(goToLoggerPage)
                .catch(error => handleErrorFromAsync(error, setError, setOpen, "Error going to logger page"));

            function goToLoggerPage() {
                dataBase.logUserExtensionInteraction('SUBMITTED:PRE_QUESTIONNAIRE');
                goToPage('LOGGER_READY', navigate)
            }
        }

        function handleGoToTasksPage() {
            dataBase.setExtensionState('TASKS_PAGE')
                .then(goToTasksPage)
                .catch(error => handleErrorFromAsync(error, setError, setOpen, "Error going to tasks page"));

            function goToTasksPage() {
                dataBase.logUserExtensionInteraction('SUBMITTED:PRE_QUESTIONNAIRE')
                dataBase.logUserExtensionInteraction("FINISHED:TASK");
                goToPage('TASKS_PAGE', navigate);
            }

        }
    }

    function getTitle(questionnaireType: string | undefined) {
        return questionnaireType === 'pre' ? <h1>Pre Questionnaire</h1> : <h1>Post Questionnaire</h1>;
    }

    function getQuestionFromParent(question: Question | undefined, index: number) {
        switch (question?.type) {
            case "MultipleChoiceQuestion":
                return <MultipleChoiceQuestionComponent question={question as MultipleChoiceQuestion}
                                                        index={index}
                                                        isValidating={isValidating}/>;
            case "TextQuestion":
                return <TextQuestionComponent question={question as TextQuestion}
                                              index={index}
                                              isValidating={isValidating}/>;
            case "RangeQuestion":
                return <RangeQuestionComponent question={question as RangeQuestion}
                                               index={index}
                                               isValidating={isValidating}/>;
            default:
                return <TextQuestionComponent question={new TextQuestion("-1", "Error", -1)}
                                              index={-1}
                                              isValidating={isValidating}/>;

        }
    }

    const contextProviderValue = useMemo(() => ({answers, updateAnswers}), [])

    function getQuestions() {
        return <>
            <AnswersContext.Provider value={contextProviderValue}>
                {questions?.map((iQuestion, index) =>
                    <div key={iQuestion.questionId} className={"p-2 text-left"}>
                        {getQuestionFromParent(iQuestion, index)}
                    </div>)}
            </AnswersContext.Provider>
        </>
    }

    function updateAnswers(questionId: string, value: string) {
        setAnswers(prev => addOrUpdateAnswers(prev, {questionId: questionId, answer: value}))
    }

    return <>
        {getTitle(questionnaireType)}
        <LoadingButton text={"back"} loadingText={"Loading..."} isLoading={isValidating} onClick={handleBack}/>
        <button className={isNextDisabled ? buttonDisabledStyle : buttonStyle}
                onClick={handleNext}
                disabled={isNextDisabled}>
            Next
        </button>
        {getQuestions()}
        <LoadingButton text={"Submit"} loadingText={"Loading..."} isLoading={isValidating}
                       onClick={handleSubmit}/>

        <Notification notificationType={'error'} message={error} open={open} setOpen={setOpen}/>
        <Notification notificationType={'success'} message={"Answers submitted!"} open={isSuccess}
                      setOpen={setIsSuccess}/>
    </>

}


