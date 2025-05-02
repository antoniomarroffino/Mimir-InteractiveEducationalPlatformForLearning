import {useContext} from "react";
import {QuestionBankListContext} from "../../contexts/questionBank/QuestionBankListContext.ts";

export const useQuestionBankList = () => {
    const context = useContext(QuestionBankListContext);
    if (context === undefined) {
        throw new Error('useQuestionBankList must be used within a QuestionBankListProvider');
    }
    return context;
}