import {createContext} from "react";
import {QuizDTO} from "@dti-isin/backend-api-client";
import {UseQueryResult} from "react-query";

export type QuizListContextType = {
    getQuizzes: (folderId: string) => {
        quizzes: QuizDTO[];
        isLoadingQuizzes: boolean;
        errorQuizzes: Error | null;
        refetchQuizzes: () => Promise<UseQueryResult<QuizDTO[], Error>>;
    };
};

export const QuizListContext = createContext<QuizListContextType | undefined>(undefined);