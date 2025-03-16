import { createContext } from "react";
import { QuizDTO } from "@dti-isin/backend-api-client";

export type QuizContextType = {
    quizzes: QuizDTO[];
    isLoadingQuizzes: boolean;
    errorQuizzes: Error | null;
    selectedQuizId: string | null;
    setSelectedQuizId: (id: string | null) => void;
    createQuiz: (name: string) => Promise<QuizDTO>;
    fetchQuizzes: () => Promise<void>;
    isCreatingQuiz: boolean;
    errorCreateQuiz: Error | null;
    deleteQuiz: (quizId: string) => Promise<void>;
    isDeletingQuiz: boolean;
    errorDeleteQuiz: Error | null;
};

export const QuizContext = createContext<QuizContextType | undefined>(undefined);