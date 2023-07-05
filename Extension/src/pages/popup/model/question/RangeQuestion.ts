import {Question} from "@pages/popup/model/question/Question";
import {IRangeQuestion} from "@pages/popup/Database/DatabaseInterfaces";

export class RangeQuestion extends Question {
    private _range: number;


    constructor(id = "-1", question = "Error", range = 5) {
        super(id, question, "RangeQuestion");
        this._range = range;
    }

    get range(): number {
        return this._range;
    }

    set range(value: number) {
        this._range = value;
    }

    mapToIQuestion(): IRangeQuestion {
        return {
            questionId: this.questionId,
            type: this.type,
            questionText: this.questionText,
            range: this.range
        }
    }
}