import {MultipleChoiceQuestion} from "@pages/popup/model/question/MultipleChoiceQuestion";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {ChangeEvent, useState} from "react";
import {useAnswersContext} from "@pages/popup/Contexts";

interface Props {
    question: MultipleChoiceQuestion;
    index: number;
    isValidating: boolean;
}

export function MultipleChoiceQuestionComponent({question, index, isValidating}: Props) {
    const [value, setValue] = useState(question.choices[0]);
    const {updateAnswers} = useAnswersContext();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const answer = (event.target as HTMLInputElement).value;
        setValue(answer);
        updateAnswers(question.questionId, answer);
    };
    console.log("MultipleChoiceQuestionComponent", question);


    return <>
        <div>{index}) {question.questionText}</div>
        <FormControl disabled={isValidating}>
            <FormLabel id="demo-controlled-radio-buttons-group" style={{color: '#FFFFFF'}}>Answers</FormLabel>
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