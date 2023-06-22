import {RangeQuestion} from "@pages/popup/model/question/RangeQuestion";
import {Slider} from "@mui/material";
import {useState} from "react";
import {useAnswersContext} from "@pages/popup/Contexts";


interface Props {
    question: RangeQuestion;
    index: number;
    isValidating: boolean;
}

interface Mark {
    value: number;
    label: string;
}


export function RangeQuestionComponent({question, index, isValidating}: Props) {
    const max = question.range;
    const [value, setValue] = useState<number>(1);

    const {updateAnswers} = useAnswersContext();

    function getMarks(max: number): Mark[] {
        const arrayWithNumbers = Array.from(Array(max).keys());
        return arrayWithNumbers.map((value): Mark => ({value: value + 1, label: `${value + 1}`}));
    }

    function handleChange(value: number | number[]) {
        setValue(value as number);
        updateAnswers(question.questionId, `${value}`);
    }

    return <>
        <div>{index}) {question.questionText}</div>
        <div>
            <Slider
                aria-label="answer-value"
                defaultValue={1}
                getAriaValueText={(value,) => `${value}`}
                valueLabelDisplay="auto"
                step={1}
                marks={getMarks(max)}
                min={1}
                max={max}
                value={value}
                onChange={(event, value) => handleChange(value)}
                disabled={isValidating}
            />
        </div>

    </>;
}