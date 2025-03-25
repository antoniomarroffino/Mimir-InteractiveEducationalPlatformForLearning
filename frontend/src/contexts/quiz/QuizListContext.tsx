import {createContext} from "react";
import {QuizDTO} from "@dti-isin/backend-api-client";

export type QuizListContextType = {
    quizzes: QuizDTO[];
    isLoadingQuizzes: boolean;
    errorQuizzes: Error | null;
    refetchQuizzes: () => Promise<void>;
    getQuizzesForFolder: (folderId: string) => {
        quizzes: QuizDTO[];
        isLoadingQuizzes: boolean;
        errorQuizzes: Error | null;
        refetchQuizzes: () => Promise<void>;
    };
};

export const QuizListContext = createContext<QuizListContextType | undefined>(undefined);