import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {createContext} from "react";

export type QuizAttemptListContextType = {
    quizAttempts: QuizAttemptDTO[];
    isLoadingQuizAttempts: boolean;
    errorQuizAttempts: Error | null;
    fetchQuizAttemptsByPublication: (publicationId: string) => Promise<void>;
    getQuizAttemptById: (attemptId: string) => Promise<QuizAttemptDTO>;
};

export const QuizAttemptListContext = createContext<QuizAttemptListContextType | undefined>(undefined);