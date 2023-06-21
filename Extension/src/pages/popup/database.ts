// db.ts
import Dexie, {Table} from 'dexie';
import {
    IAnswer,
    ICurrentTaskId,
    IDemographics,
    IExtensionState,
    IMultipleChoiceQuestion,
    IQuestion,
    IRangeQuestion,
    ISerpHtml,
    IStudy,
    ITab,
    ITask,
    ITextQuestion,
    IUser,
    IUserExtensionInteraction
} from "@pages/popup/Interfaces";
import {MultipleChoiceQuestion} from "@pages/popup/model/question/MultipleChoiceQuestion";
import {TextQuestion} from "@pages/popup/model/question/TextQuestion";
import {RangeQuestion} from "@pages/popup/model/question/RangeQuestion";
import {ExtensionState, QuestionnaireType, UserExtensionAction} from "@pages/popup/Types";
import {getUTCDateTime} from "@pages/popup/UtilityFunctions";
import {fgLoggingConstants} from "@pages/popup/Consts/FgLoggingConstants";
import {Question} from "@pages/popup/model/question/Question";


class DataBase extends Dexie {
    user!: Table<IUser, string>;
    study!: Table<IStudy, string>;
    task!: Table<ITask, string>;
    multipleChoiceQuestion!: Table<IMultipleChoiceQuestion, string>;
    rangeQuestion!: Table<IRangeQuestion, string>;
    textQuestion!: Table<ITextQuestion, string>;
    demographics!: Table<IDemographics, string>;
    answers!: Table<IAnswer, string>;
    tabs!: Table<ITab, string>;
    userExtensionInteraction!: Table<IUserExtensionInteraction, string>;
    currentTaskId!: Table<ICurrentTaskId, string>;
    extensionState!: Table<IExtensionState, string>;
    serpHtml!: Table<ISerpHtml, string>;

    //...other tables goes here...

    constructor() {
        super('DataBase');
        this.version(1).stores({
            user: 'id, userId',
            study: 'studyId, hasDemographics',
            task: 'taskId, text, iPreQuestions, iPostQuestions, isStarted, isCompleted, isPreQuestionsSubmitted, isPostQuestionsSubmitted',
            multipleChoiceQuestion: 'questionId, questionText, type, choices',
            rangeQuestion: 'questionId, questionText, type, range',
            textQuestion: 'questionId, questionText, type, maxCharacters',
            demographics: 'id, birthDate, job, sex',
            answers: 'questionId, userId, studyId, taskId, answer, query, searchEngineName',
            tabs: '++id, tabId, action, timeStamp, userId, studyId, taskId, groupId, tabIndex, windowId, title, url',
            userExtensionInteraction: '++id, action, timeStamp, userId, studyId, taskId',
            currentTaskId: 'id, taskId',
            extensionState: 'id, state',
            serpHtml: '++id,timeStamp, innerHtml, innerText'
        });
    }

    setUserId(userId: string) {
        const iUser: IUser = {id: 0, userId: userId}
        dataBase.user.put(iUser);
    }

    async getITasks() {
        let iTasks: ITask[] = [];
        await dataBase.task.toArray()
            .then((iTask) => iTasks = iTask);
        return iTasks;
    }

    async getQuestionUsingInterface(iQuestion: IQuestion) {
        switch (iQuestion.type) {
            case "MultipleChoiceQuestion": {
                const iMultiQuestion = await dataBase.multipleChoiceQuestion.get(
                    iQuestion.questionId
                );

                return new MultipleChoiceQuestion(
                    iMultiQuestion?.questionId,
                    iMultiQuestion?.questionText,
                    iMultiQuestion?.choices
                );
            }
            case "TextQuestion": {
                const iTextQuestion = await dataBase.textQuestion.get(
                    iQuestion.questionId
                );
                return new TextQuestion(
                    iTextQuestion?.questionId,
                    iTextQuestion?.questionText,
                    iTextQuestion?.maxCharacters
                );
            }
            case "RangeQuestion": {
                const iRangeQuestion = await dataBase.rangeQuestion.get(
                    iQuestion.questionId
                );
                return new RangeQuestion(
                    iRangeQuestion?.questionId,
                    iRangeQuestion?.questionText,
                    iRangeQuestion?.range
                );
            }
            default:
                return new TextQuestion(undefined, undefined, undefined);
        }
    }

    async getQuestionnaireInterfaces(taskId: string, questionnaireType: string | undefined) {
        const isQuestionnaireTypeLegal = questionnaireType === 'pre' || questionnaireType === 'post';
        if (!isQuestionnaireTypeLegal) throw new Error("questionnaireType is not legal");

        let questions: IQuestion[] = [];
        await dataBase.task.get(taskId)
            .then(iTask => {
                if (questionnaireType === 'pre') questions = iTask?.iPreQuestions ?? []
                else questions = iTask?.iPostQuestions ?? []
            });
        return questions;
    }

    async getQuestionnaire(taskId: string, questionnaireType: string | undefined) {
        const iQuestionnaire = await this.getQuestionnaireInterfaces(taskId, questionnaireType);

        const questionnaire: Question[] = [];
        for (const iQuestion of iQuestionnaire) {
            const question = await this.getQuestionUsingInterface(iQuestion);
            questionnaire.push(question);
        }
        return questionnaire;
    }

    async setDemographics(demographics: IDemographics) {
        await dataBase.demographics.put(demographics);
    }

    async submitQuestionnaire(taskId: string, answers: IAnswer[], questionnaireType: string | undefined) {
        const isQuestionnaireTypeLegal = questionnaireType === 'pre' || questionnaireType === 'post';
        if (!isQuestionnaireTypeLegal) throw new Error("questionnaireType is not legal");

        await dataBase.answers.bulkPut(answers);
    }

    async getStudyId(): Promise<string | undefined> {
        const studies = await dataBase.study.toArray();
        return studies[0]?.studyId;
    }

    async getUserId(): Promise<string | undefined> {
        const users = await dataBase.user.toArray();
        return users[0]?.userId;
    }

    async getCurrentTaskId(): Promise<string | undefined> {
        const ids = await dataBase.currentTaskId.toArray();
        return ids[0]?.taskId;
    }

    async setCurrentTaskId(taskId: string) {
        const iCurrentTaskId: ICurrentTaskId = {id: 0, taskId: taskId};
        dataBase.currentTaskId.put(iCurrentTaskId);
    }

    async getExtensionState(): Promise<ExtensionState | undefined> {
        const states = await dataBase.extensionState.toArray();
        return states[0]?.state;
    }

    setExtensionState(state: ExtensionState) {
        const iExtensionState: IExtensionState = {id: 0, state: state};
        dataBase.extensionState.put(iExtensionState);
    }

    async setQuestionnaireSubmitted(taskId: string, questionnaireType: string | undefined) {
        const isQuestionnaireTypeLegal = questionnaireType === 'pre' || questionnaireType === 'post';
        if (!isQuestionnaireTypeLegal) throw new Error("questionnaireType is not legal");
        const updatedItem = questionnaireType === 'pre' ? {isPreQuestionsSubmitted: true} : {isPostQuestionsSubmitted: true};
        dataBase.task.update(taskId, updatedItem);
    }

    async getLoggingConstants() {
        const userId = await this.getUserId() ?? "";
        const studyId = await this.getStudyId() ?? "";
        const taskId = await this.getCurrentTaskId() ?? "";
        return {userId: userId, studyId: studyId, taskId: taskId};
    }

    saveTabInfo(iTab: ITab) {
        dataBase.tabs.add(iTab);
    }

    getLastTabWithId(tabId: number) {
        return dataBase.tabs.where("tabId").equals(tabId).last();
    }

    doesTaskHasQuestionnaire(taskId: string, questionnaireType: QuestionnaireType) {
        return dataBase.task.get(taskId).then(iTask => {
            return questionnaireType === 'pre' ? iTask?.iPreQuestions.length !== 0 : iTask?.iPostQuestions.length !== 0
        });
    }

    logUserExtensionInteraction(action: UserExtensionAction): void {
        const log = {
            action: action,
            timeStamp: getUTCDateTime(),
            userId: fgLoggingConstants.userId,
            studyId: fgLoggingConstants.studyId,
            taskId: fgLoggingConstants.taskId
        }

        dataBase.userExtensionInteraction.add(log);
    }

    saveStudyInfo(study: IStudy, tasks: ITask[], multipleChoiceQuestions: IMultipleChoiceQuestion[], textQuestions: ITextQuestion[], rangeQuestions: IRangeQuestion[]) {
        dataBase.study.add(study)
        dataBase.task.bulkAdd(tasks)
        dataBase.multipleChoiceQuestion.bulkAdd(multipleChoiceQuestions);
        dataBase.textQuestion.bulkAdd(textQuestions);
        dataBase.rangeQuestion.bulkAdd(rangeQuestions);
    }

    isStudyExists(): Promise<boolean> {
        return dataBase.study.count().then(count => count > 0);
    }


    async getDemographics() {
        const deFaultDemographics: IDemographics = {id: '0', job: "", sex: "sex", birthDate: ''};
        const demographics = await this.demographics.toArray()
        return demographics[0] ?? deFaultDemographics;
    }

    setTaskCompleted(taskId: string) {
        this.task.update(taskId, {isCompleted: true});
    }

    setTaskStarted(taskId: string) {
        this.task.update(taskId, {isStarted: true});
    }

    addSerpHtml(innerHtml: string, innerText: string) {
        const iHtml: ISerpHtml = {
            timeStamp: getUTCDateTime(),
            innerHtml: innerHtml,
            innerText: innerText
        }
        this.serpHtml.add(iHtml);
    }

    async getHasDemographics() {
        const Studies = await this.study.toArray();
        return Studies[0]?.hasDemographics;

    }
}

export const dataBase = new DataBase();