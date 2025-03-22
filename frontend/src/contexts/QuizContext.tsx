import { createContext } from "react";
import { QuizDTO } from "@dti-isin/backend-api-client";

export type QuizContextType = {
    quizzes: QuizDTO[];
    isLoadingQuizzes: boolean;
    errorQuizzes: Error | null;
    createQuiz: (courseId: string, folderId: string, name: string) => Promise<QuizDTO>;
    deleteQuiz: (courseId: string, folderId: string, quizId: string) => Promise<void>;
    isCreatingQuiz: boolean;
    errorCreateQuiz: Error | null;
    isDeletingQuiz: boolean;
    errorDeleteQuiz: Error | null;
};

export const QuizContext = createContext<QuizContextType | undefined>(undefined);