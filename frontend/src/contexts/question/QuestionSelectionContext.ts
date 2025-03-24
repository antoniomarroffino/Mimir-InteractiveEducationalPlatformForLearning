import { QuestionDTO } from "@dti-isin/backend-api-client/dist/models/question-dto";
import {createContext} from "react";

export type QuestionSelectionContextType = {
    selectedQuestionId: string | null;
    setSelectedQuestionId: (id: string | null) => void;
    selectedQuestion: QuestionDTO | null;
    setSelectedQuestion: (question: QuestionDTO | null) => void;
    selectQuestion: (question: QuestionDTO) => void;
    deselectQuestion: () => void;
}

export const QuestionSelectionContext = createContext<QuestionSelectionContextType | undefined>(undefined);