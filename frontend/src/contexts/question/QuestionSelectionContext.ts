import { QuestionDTO } from "@dti-isin/backend-api-client/dist/models/question-dto";
import {createContext} from "react";

export type QuestionSelectionContextType = {
    selectedQuestionId: string | null;
    selectedQuestion: QuestionDTO | null;
    selectQuestion: (id: string) => void;
    deselectQuestion: () => void;
    validateSelection: () => void;
}

export const QuestionSelectionContext = createContext<QuestionSelectionContextType | undefined>(undefined);