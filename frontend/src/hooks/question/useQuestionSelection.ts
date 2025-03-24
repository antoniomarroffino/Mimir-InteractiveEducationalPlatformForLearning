import {useContext} from "react";
import {QuestionSelectionContext} from "../../contexts/question/QuestionSelectionContext.ts";

export const useQuestionSelection = () => {
    const context = useContext(QuestionSelectionContext);
    if (context === undefined) {
        throw new Error('useQuestionSelection must be used within a QuestionSelectionProvider');
    }
    return context;

}