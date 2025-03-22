import React, { createContext } from "react";
import { QuizDTO } from "@dti-isin/backend-api-client";

export type QuizContextType = {
    quizzes: QuizDTO[];
    isLoadingQuizzes: boolean;
    errorQuizzes: Error | null;
    selectedQuizId: string | null;
    setSelectedQuizId: React.Dispatch<React.SetStateAction<string | null>>;
    createQuiz: (name: string) => Promise<QuizDTO>;
    fetchQuizzes: () => Promise<void>;
    isCreatingQuiz: boolean;
    errorCreateQuiz: Error | null;
    deleteQuiz: (quizId: string) => Promise<void>;
    isDeletingQuiz: boolean;
    errorDeleteQuiz: Error | null;
    getQuizById: (quizId: string) => Promise<QuizDTO | null>;
};

export const QuizContext = createContext<QuizContextType | undefined>(undefined);