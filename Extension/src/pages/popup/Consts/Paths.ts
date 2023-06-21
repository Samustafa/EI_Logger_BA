import {QuestionnaireType} from "@pages/popup/Types";

const initializationPage = '/'
const landingPage = '/landingPage';
const tasksPage = "/tasksPage";
const fetchingStudyData = '/fetchingStudyData';
const demographicsPage = '/demographicsPage';
const idDisplayPage = '/idDisplayPage';
const defaultQuestionnaire = '/questionnairePage/:questionnaireType';
const loggerPage = '/loggerPage';
const uploadPage = '/uploadPage'; //this upload page should only be seen when the study has no tasks and the searcher finishes logging

function questionnairePage(questionnaireType: QuestionnaireType) {
    return `/questionnairePage/${questionnaireType}`;
}


export default {
    initializationPage,
    landingPage,
    idDisplayPage,
    tasksPage,
    fetchingStudyData,
    questionnairePage,
    loggerPage,
    demographicsPage,
    defaultQuestionnaire,
    uploadPage
}
