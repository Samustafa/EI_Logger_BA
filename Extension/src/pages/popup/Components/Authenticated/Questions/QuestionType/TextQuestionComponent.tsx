import {TextQuestion} from "@pages/popup/model/question/TextQuestion";
import {inputDefaultStyle} from "@pages/popup/Consts/Styles";
import {ChangeEvent, useState} from "react";
import {useAnswersContext} from "@pages/popup/Contexts";

interface Props {
    question: TextQuestion;
    isValidating: boolean;
}

export function TextQuestionComponent({question, isValidating}: Props) {

    const [answer, setAnswer] = useState<string>("");
    const {updateAnswers} = useAnswersContext();

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const answer = event.target.value;
        setAnswer(answer);
        updateAnswers(question.questionId, answer);
    }

    return <>
        <input
            className={inputDefaultStyle}
            type="text"
            placeholder={"type your answer here"}
            required={true}
            value={answer}
            onChange={handleChange}
            disabled={isValidating}
            maxLength={question.maxCharacters}
        />
    </>
}