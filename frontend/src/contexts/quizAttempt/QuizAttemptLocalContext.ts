import {createContext} from "react";
import {QuestionResponseDTO, QuizAttemptDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";

export type QuizAttemptLocalContextType = {
    currentAttempt: Partial<QuizAttemptDTO> | null;
    startQuizAttempt: (publication: QuizPublicationDTO) => Promise<void>;
    updateQuizAttemptResponses: (responses: QuestionResponseDTO[]) => void;
    completeQuizAttempt: (userResponsesOverride?: QuestionResponseDTO[]) => Promise<QuizAttemptDTO>;
    resetQuizAttempt: () => void;
    prepareQuizResponses: (publication: QuizPublicationDTO) => QuestionResponseDTO[];
};

export const QuizAttemptLocalContext = createContext<QuizAttemptLocalContextType | undefined>(undefined);