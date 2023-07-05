import {Question} from "@pages/popup/model/question/Question";
import {castToChildQuestion} from "@pages/popup/UtilityFunctions";
import {IQuestion} from "@pages/popup/Database/DatabaseInterfaces";

export class Task {
    private _taskId: string;
    private _text: string;
    private _preQuestions?: Question[];
    private _postQuestions?: Question[];
    private _hasPreQuestionnaire: boolean;
    private _hasPostQuestionnaire: boolean;

    constructor(taskId: string, text: string, preQuestions?: Question[], postQuestions?: Question[]) {
        this._taskId = taskId;
        this._text = text;
        this._preQuestions = preQuestions?.map((q: Question) => castToChildQuestion(q));
        this._postQuestions = postQuestions?.map((q: Question) => castToChildQuestion(q));
        this._hasPreQuestionnaire = !!preQuestions && preQuestions.length > 0;
        this._hasPostQuestionnaire = !!postQuestions && postQuestions.length > 0;
    }

    getIPreQuestions(): IQuestion[] | [] {
        return this._preQuestions?.map(question => ({questionId: question.questionId, type: question.type})) ?? [];
    }

    getIPostQuestions(): IQuestion[] | [] {
        return this._postQuestions?.map(question => ({questionId: question.questionId, type: question.type})) ?? [];
    }

    extractQuestions() {
        const preQuestions = this._preQuestions?.map((q: Question) => q.mapToIQuestion()) ?? []
        const postQuestions = this._postQuestions?.map((q: Question) => q.mapToIQuestion()) ?? []

        return [...preQuestions, ...postQuestions]
    }

    get taskId(): string {
        return this._taskId;
    }

    set taskId(value: string) {
        this._taskId = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get hasPreQuestionnaire(): boolean {
        return this._hasPreQuestionnaire;
    }

    set hasPreQuestionnaire(value: boolean) {
        this._hasPreQuestionnaire = value;
    }

    get hasPostQuestionnaire(): boolean {
        return this._hasPostQuestionnaire;
    }

    set hasPostQuestionnaire(value: boolean) {
        this._hasPostQuestionnaire = value;
    }


    get preQuestions(): Question[] {
        return this._preQuestions ?? [];
    }

    set preQuestions(value: Question[]) {
        this._preQuestions = value;
    }

    get postQuestions(): Question[] {
        return this._postQuestions ?? [];
    }

    set postQuestions(value: Question[]) {
        this._postQuestions = value;
    }
}