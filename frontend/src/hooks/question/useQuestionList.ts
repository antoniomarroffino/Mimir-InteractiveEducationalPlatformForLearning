import {useContext} from "react";
import {QuestionListContext} from "../../contexts/question/QuestionListContext.ts";

export const useQuestionList = () => {
    const context = useContext(QuestionListContext);
    if(context === undefined) {
        throw new Error('useQuestionList must be used within a QuestionListProvider');
    }
    return context;
}