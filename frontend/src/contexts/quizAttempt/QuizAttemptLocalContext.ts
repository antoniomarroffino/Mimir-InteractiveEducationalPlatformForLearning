import { createContext } from "react";
import {
    QuizAttemptDTO,
    QuizPublicationDTO,
    QuestionResponseDTO
} from "@dti-isin/backend-api-client";

export type QuizAttemptLocalContextType = {
    currentAttempt: Partial<QuizAttemptDTO> | null;
    startQuizAttempt: (publication: QuizPublicationDTO) => Promise<QuizAttemptDTO>;
    updateQuizAttemptResponses: (responses: QuestionResponseDTO[]) => void;
    completeQuizAttempt: () => Promise<void>;
    resetQuizAttempt: () => void;
    prepareQuizResponses: (responses: QuestionResponseDTO[]) => void;
};

export const QuizAttemptLocalContext = createContext<QuizAttemptLocalContextType | undefined>(undefined);