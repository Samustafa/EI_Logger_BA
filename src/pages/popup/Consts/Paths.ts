import {QuestionnaireType} from "@pages/popup/Types";

const initializationPage = '/'
const landingPage = '/landingPage';
const tasksPage = "/tasksPage";
const fetchingStudyData = '/fetchingStudyData';
const demographicsPage = '/demographicsPage';
const idDisplayPage = '/idDisplayPage';
const defaultQuestionnaire = '/questionnairePage/:questionnaireType';
const loggerPage = '/loggerPage';


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
    defaultQuestionnaire
}
