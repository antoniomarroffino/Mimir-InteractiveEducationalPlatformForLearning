import {createContext} from "react";
import {QuizDTO} from "@dti-isin/backend-api-client";

export type QuizSelectionContextType = {
    selectedQuizId: string | null;
    selectedQuiz: QuizDTO | null;
    setSelectedQuizId: (id: string | null) => void;
    selectQuiz: (id: string) => void;
    deselectQuiz: () => void;
    currentFolderId: string | null;
    setCurrentFolder: (folderId: string) => void;
};

export const QuizSelectionContext = createContext<QuizSelectionContextType | undefined>(undefined);