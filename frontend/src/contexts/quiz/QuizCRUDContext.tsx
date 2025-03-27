import {QuizDTO} from "@dti-isin/backend-api-client/dist/models/quiz-dto";
import {createContext} from "react";

export type QuizCRUDContextType = {
    createQuiz: (folderId: string, name: string, description?: string) => Promise<QuizDTO>;
    updateQuiz: (folderId: string, quizId: string, quizDTO: QuizDTO) => Promise<QuizDTO>;
    deleteQuiz: (folderId: string, quizId: string) => Promise<void>;

    isCreatingQuiz: boolean;
    isUpdatingQuiz: boolean;
    isDeletingQuiz: boolean;

    errorCreateQuiz: Error | null;
    errorUpdateQuiz: Error | null;
    errorDeleteQuiz: Error | null;
}

export const QuizCRUDContext = createContext<QuizCRUDContextType | undefined>(undefined);