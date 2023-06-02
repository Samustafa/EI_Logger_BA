import {createContext, useContext} from "react";
import {AnswersContextType} from "@pages/popup/Types";

export const AnswersContext = createContext<AnswersContextType>({
    answers: [],
    updateAnswers: (answers) => console.log("setAnswers not implemented", answers)
});

export const useAnswersContext = () => useContext(AnswersContext);