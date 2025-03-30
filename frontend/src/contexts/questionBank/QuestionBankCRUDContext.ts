import {QuestionBankDTO} from "@dti-isin/backend-api-client";
import {createContext} from "react";

export type QuestionBankCRUDContextType = {
    createQuestionBank: (questionBankDTO: QuestionBankDTO) => Promise<QuestionBankDTO>,
    updateQuestionBank: (id: string, questionBankDTO: QuestionBankDTO) => Promise<QuestionBankDTO>,
    deleteQuestionBank: (id: string) => Promise<void>,

    isCreatingQuestionBank: boolean,
    isUpdatingQuestionBank: boolean,
    isDeletingQuestionBank: boolean,

    errorCreateQuestionBank: Error | null,
    errorUpdateQuestionBank: Error | null,
    errorDeleteQuestionBank: Error | null,
}

export const QuestionBankCRUDContext = createContext<QuestionBankCRUDContextType | undefined>(undefined)