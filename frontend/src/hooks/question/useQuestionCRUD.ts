import {useContext} from "react";
import {QuestionCRUDContext} from "../../contexts/question/QuestionCRUDContext.ts";

export const useQuestionCRUD = () => {
    const context = useContext(QuestionCRUDContext);
    if (context === undefined) {
        throw new Error('useQuestionCRUD must be used within a QuestionCRUDProvider');
    }
    return context;
};