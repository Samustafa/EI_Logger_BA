import {Question} from "@pages/popup/model/question/Question";
import {IMultipleChoiceQuestion} from "@pages/popup/Database/DatabaseInterfaces";

export class MultipleChoiceQuestion extends Question {

    private _choices: string[];

    constructor(id = "-1", question = "error", choices = ["error"]) {
        super(id, question, "MultipleChoiceQuestion");
        this._choices = choices;
    }

    get choices(): string[] {
        return this._choices;
    }

    set choices(value: string[]) {
        this._choices = value;
    }

    mapToIQuestion(): IMultipleChoiceQuestion {
        return {
            questionId: this.questionId,
            type: this.type,
            questionText: this.questionText,
            choices: this.choices
        };
    }
}