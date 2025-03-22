import { createContext } from "react";
import { QuizDTO } from "@dti-isin/backend-api-client";

export type QuizRetrieveContextType = {
    quiz: QuizDTO | null;
    isLoading: boolean;
    error: Error | null;
    retrieveQuiz: (courseId: string, folderId: string, quizId: string) => Promise<void>;
};

export const QuizRetrieveContext = createContext<QuizRetrieveContextType | undefined>(undefined);