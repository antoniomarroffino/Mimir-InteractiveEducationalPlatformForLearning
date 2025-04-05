import {createContext} from "react";
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";

export type QuizAttemptCRUDContextType = {
    createQuizAttempt: (quizAttemptDTO: QuizAttemptDTO) => Promise<QuizAttemptDTO>;
    getQuizAttemptById: (attemptId: string) => Promise<QuizAttemptDTO>;
    getQuizAttemptsByPublication: (publicationId: string) => Promise<QuizAttemptDTO[]>;
    isCreatingQuizAttempt: boolean;
    isLoadingAttempt: boolean;
    errorCreateQuizAttempt: Error | null;
    errorLoadAttempt: Error | null;
};

export const QuizAttemptCRUDContext = createContext<QuizAttemptCRUDContextType | undefined>(undefined);