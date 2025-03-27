import {createContext} from "react";
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";

export type QuizAttemptCRUDContextType = {
    createQuizAttempt: (quizAttemptDTO: QuizAttemptDTO) => Promise<QuizAttemptDTO>;
    isCreatingQuizAttempt: boolean;
    errorCreateQuizAttempt: Error | null;
};

export const QuizAttemptCRUDContext = createContext<QuizAttemptCRUDContextType | undefined>(undefined);