import { createContext } from "react";
import { QuizAttemptDTO, QuizPublicationDTO, QuestionResponseDTO } from "@dti-isin/backend-api-client";

export type QuizAttemptLocalContextType = {
    currentAttempt: Partial<QuizAttemptDTO> | null;
    startQuizAttempt: (publication: QuizPublicationDTO) => void;
    updateQuizAttemptResponses: (responses: QuestionResponseDTO[]) => void;
    completeQuizAttempt: () => void;
    resetQuizAttempt: () => void;
};

export const QuizAttemptLocalContext = createContext<QuizAttemptLocalContextType | undefined>(undefined);