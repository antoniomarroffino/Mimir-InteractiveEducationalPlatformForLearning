import {useContext} from "react";
import {QuestionBankCRUDContext} from "../../contexts/questionBank/QuestionBankCRUDContext.ts";

export const useQuestionBankCRUD = () => {
    const context = useContext(QuestionBankCRUDContext);
    if (context === undefined) {
        throw new Error('useQuestionBankCRUD must be used within a QuestionBankCRUDProvider')
    }
    return context;
}