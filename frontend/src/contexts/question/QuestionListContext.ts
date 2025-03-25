import {QuestionDTO} from "@dti-isin/backend-api-client/dist/models/question-dto"
import {createContext} from "react";
import {UseQueryResult} from "react-query";

export type QuestionListContextType = {
    questions: QuestionDTO[];
    isLoadingQuestions: boolean;
    errorQuestions: Error | null;
    fetchQuestions: (
        courseId: string,
        folderId: string,
        quizId: string
    ) => Promise<UseQueryResult<QuestionDTO[], Error>>;
    getQuestionCount: () => number;
}

export const QuestionListContext = createContext<QuestionListContextType | undefined>(undefined);