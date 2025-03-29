import {createContext} from "react";
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";

export type QuizRetrieveContextType = {
    quiz: QuizDTO | null;
    quizPublication: QuizPublicationDTO | null;
    isLoading: boolean;
    error: Error | null;
    retrieveQuiz: (quizPublication: QuizPublicationDTO) => Promise<void>;
    resetQuiz?: () => void;
};

export const QuizRetrieveContext = createContext<QuizRetrieveContextType | undefined>(undefined);