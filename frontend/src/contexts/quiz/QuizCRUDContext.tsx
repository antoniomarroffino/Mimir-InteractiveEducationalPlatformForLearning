import { createContext } from "react";
import { UseMutationResult } from "react-query";
import { QuizDTO } from "@dti-isin/backend-api-client";

export type QuizCRUDContextType = {
    createQuiz: UseMutationResult<
        QuizDTO,
        Error,
        { courseId: string; folderId: string; quizDTO: QuizDTO }
    >;
    updateQuiz: UseMutationResult<
        QuizDTO,
        Error,
        { courseId: string; folderId: string; quizId: string; quizDTO: QuizDTO }
    >;
    deleteQuiz: UseMutationResult<
        void,
        Error,
        { courseId: string; folderId: string; quizId: string }
    >;
};

export const QuizCRUDContext = createContext<QuizCRUDContextType | undefined>(undefined);
