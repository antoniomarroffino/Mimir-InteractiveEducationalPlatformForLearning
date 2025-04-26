import { createContext } from "react";
import { QuizDTO } from "@dti-isin/backend-api-client";

export type QuizCRUDContextType = {
    createQuiz: (courseId: string, folderId: string, quizDTO: QuizDTO) => Promise<QuizDTO>;
    updateQuiz: (courseId: string, folderId: string, quizId: string, quizDTO: QuizDTO) => Promise<QuizDTO>;
    deleteQuiz: (courseId: string, folderId: string, quizId: string) => Promise<void>;

    isCreatingQuiz: boolean;
    isUpdatingQuiz: boolean;
    isDeletingQuiz: boolean;

    errorCreateQuiz: Error | null;
    errorUpdateQuiz: Error | null;
    errorDeleteQuiz: Error | null;
};

export const QuizCRUDContext = createContext<QuizCRUDContextType | undefined>(undefined);
