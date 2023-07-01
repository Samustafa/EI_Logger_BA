import {MultipleChoiceQuestion} from "@pages/popup/model/question/MultipleChoiceQuestion";
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {ChangeEvent, useState} from "react";
import {useAnswersContext} from "@pages/popup/Contexts";

interface Props {
    question: MultipleChoiceQuestion;
    isValidating: boolean;
}

export function MultipleChoiceQuestionComponent({question, isValidating}: Props) {
    const [value, setValue] = useState(question.choices[0]);
    const {updateAnswers} = useAnswersContext();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const answer = (event.target as HTMLInputElement).value;
        setValue(answer);
        updateAnswers(question.questionId, answer);
    };


    return <>
        <FormControl disabled={isValidating}>
            <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                {question.choices.map((choice) => <FormControlLabel key={choice} value={choice}
                                                                    control={<Radio size="small"/>}
                                                                    label={choice}/>)}
            </RadioGroup>
        </FormControl>

    </>
}