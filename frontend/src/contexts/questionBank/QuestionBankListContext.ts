import {QuestionBankDTO} from "@dti-isin/backend-api-client";
import {createContext} from "react";

export type QuestionBankListContextType = {
    questionBanks: QuestionBankDTO[];

    isLoadingQuestionBanks: boolean;

    errorQuestionBanks: Error | null;

    fetchQuestionBanks: () => Promise<void>;
}

export const QuestionBankListContext = createContext<QuestionBankListContextType | undefined>(undefined);