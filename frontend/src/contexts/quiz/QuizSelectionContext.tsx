import {createContext} from "react";
import {QuizDTO} from "@dti-isin/backend-api-client";

export type QuizSelectionContextType = {
    selectedQuizId: string | null;
    selectedQuiz: QuizDTO | null;
    selectQuiz: (id: string) => void;
    deselectQuiz: () => void;
    validateSelection: () => void;
};

export const QuizSelectionContext = createContext<QuizSelectionContextType | undefined>(undefined);