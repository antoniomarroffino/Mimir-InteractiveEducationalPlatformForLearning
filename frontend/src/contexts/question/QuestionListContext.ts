import { QuestionDTO } from "@dti-isin/backend-api-client/dist/models/question-dto"
import {createContext} from "react";

export type QuestionListContextType = {
    questions: QuestionDTO[];

    isLoadingQuestions: boolean;

    errorQuestions: Error | null;

    fetchQuestions: () => Promise<void>;
}

export const QuestionListContext = createContext<QuestionListContextType | undefined>(undefined);