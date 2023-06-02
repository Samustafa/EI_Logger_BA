import {QuestionTypeAsString} from "@pages/popup/Types";
import {IQuestion} from "@pages/popup/Interfaces";

export abstract class Question {
    private _questionId: string;
    private _questionText: string;
    private _type: QuestionTypeAsString;

    protected constructor(id: string, question: string, type: QuestionTypeAsString) {
        this._questionId = id;
        this._questionText = question;
        this._type = type;
    }

    get questionId(): string {
        return this._questionId;
    }

    set questionId(value: string) {
        this._questionId = value;
    }

    get questionText(): string {
        return this._questionText;
    }

    set questionText(value: string) {
        this._questionText = value;
    }

    get type(): QuestionTypeAsString {
        return this._type;
    }

    set type(value: QuestionTypeAsString) {
        this._type = value;
    }

    abstract mapToIQuestion(): IQuestion;
}