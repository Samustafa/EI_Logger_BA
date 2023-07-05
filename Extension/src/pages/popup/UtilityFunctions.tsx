import {IApiException, IQuestionAnswer} from "@pages/popup/Database/DatabaseInterfaces";
import {
    ContentScriptMessage,
    ContentScriptResponse,
    ExtensionState,
    MessageType,
    Port,
    PortNameBG,
    QuestionType
} from "@pages/popup/Types";
import {MultipleChoiceQuestion} from "@pages/popup/model/question/MultipleChoiceQuestion";
import {RangeQuestion} from "@pages/popup/model/question/RangeQuestion";
import {TextQuestion} from "@pages/popup/model/question/TextQuestion";
import {Question} from "@pages/popup/model/question/Question";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import browser from "webextension-polyfill";
import {dataBase} from "@pages/popup/Database/database";
import Paths from "@pages/popup/Constants/Paths";
import {NavigateFunction} from "react-router-dom";
import React, {Dispatch} from "react";

dayjs.extend(utc);


/**
 * Extracts the server exception from response or extracts error message if server didn't respond, opens a notification
 * @param error     the error object from catch block
 * @param setError  sets the error state in the calling component
 * @param setOpen   opens the notification
 * @param message   optional message to be displayed before the error message
 */
export function handleErrorFromAsync(error: any, setError: Dispatch<React.SetStateAction<string>>, setOpen: Dispatch<React.SetStateAction<boolean>>, message = '') {
    extractAndSetError(error, setError, message);
    setOpen(true);


    function extractAndSetError(error: any, setError: Dispatch<React.SetStateAction<string>>, message: string) {
        console.error(error)

        const serverException: IApiException = error?.response?.data;
        const errorMessage = serverException?.message || error?.message || error?.toString();

        setError(message + ' ' + errorMessage);
    }
}

export function castToChildQuestion(question: Question): QuestionType {
    switch (question.type) {
        case "MultipleChoiceQuestion": {
            const castedQuestion = question as MultipleChoiceQuestion;
            return new MultipleChoiceQuestion(castedQuestion.questionId, castedQuestion.questionText, castedQuestion.choices)
        }
        case "RangeQuestion": {
            const castedQuestion = question as RangeQuestion;
            return new RangeQuestion(castedQuestion.questionId, castedQuestion.questionText, castedQuestion.range);
        }
        case "TextQuestion": {
            const castedQuestion = question as TextQuestion;
            return new TextQuestion(castedQuestion.questionId, castedQuestion.questionText, castedQuestion.maxCharacters);
        }
    }
}

export function addOrUpdateAnswers(iQuestionAnswers: IQuestionAnswer[], answer: IQuestionAnswer) {
    const index = iQuestionAnswers.findIndex((a) => a.questionId === answer.questionId);

    if (-1 === index) {
        return [...iQuestionAnswers, answer];
    }
    return [...iQuestionAnswers.slice(0, index), answer, ...iQuestionAnswers.slice(index + 1)];
}

export function display(message: string) {
    return (<div>{message}</div>);
}

export function getUTCDateTime(): string {
    return dayjs.utc().format("YYYY-MM-DD HH:mm:ss");
}

/**
 * connect to background port
 * @param portName
 */
export function connectToBGPort(portName: PortNameBG): Port {
    return browser.runtime.connect({name: portName});
}

export function sendMessageToCS(tabId: number, serpIdentifier: string, message: ContentScriptMessage) {

    if (message === "LOG_HTML_OF_SERP") {
        browser.tabs.sendMessage(tabId, message)
            .then((response: ContentScriptResponse) => handleContentMessageResponse(response))
            .catch((error) => console.error("sendMessageToCS", error));
    }

    function handleContentMessageResponse(response: ContentScriptResponse) {
        const innerHTML = response.innerHTML;
        const innerText = response.innerText;
        dataBase.addSerpHtml(serpIdentifier, innerHTML, innerText);
    }
}

export function sendMessages(port: Port, message: MessageType) {
    port.postMessage(message);
}

export function goToPage(extensionState: ExtensionState | undefined, navigate: NavigateFunction) {
    switch (extensionState) {
        case "NOT_AUTHENTICATED":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.landingPage))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "DISPLAYING_ID":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.idDisplayPage))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "DEMOGRAPHICS":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.demographicsPage))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "TASKS_PAGE":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.tasksPage))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "PRE_QUESTIONNAIRE":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.questionnairePage('pre')))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "LOGGER_READY":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.loggerPage, {state: false}))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "LOGGING":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.loggerPage, {state: true}))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "POST_QUESTIONNAIRE":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.questionnairePage('post')))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "FETCHING_STUDY":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.fetchingStudyData))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        case "UPLOAD_PAGE":
            dataBase.setExtensionState(extensionState)
                .then(() => navigate(Paths.uploadPage))
                .catch(error => console.error("goToPage", extensionState, error));
            break;
        default:
            dataBase.setExtensionState('NOT_AUTHENTICATED')
                .then(() => navigate(Paths.landingPage))
                .catch(error => console.error("goToPage", extensionState, error));
    }
}

