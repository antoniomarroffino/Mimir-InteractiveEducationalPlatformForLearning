import { QuizDTO } from "@dti-isin/backend-api-client/dist/models/quiz-dto";
import {createContext} from "react";

export type QuizCRUDContextType = {
    createQuiz: (name: string, description?: string) => Promise<QuizDTO>;
    updateQuiz: (quizId: string, quizDTO: QuizDTO) => Promise<QuizDTO>;
    deleteQuiz: (quizId: string) => Promise<void>;

    isCreatingQuiz: boolean;
    isUpdatingQuiz: boolean;
    isDeletingQuiz: boolean;

    errorCreateQuiz: Error | null;
    errorUpdateQuiz: Error | null;
    errorDeleteQuiz: Error | null;
}

export const QuizCRUDContext = createContext<QuizCRUDContextType | undefined>(undefined);