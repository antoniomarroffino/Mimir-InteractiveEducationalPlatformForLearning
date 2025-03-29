import { createContext } from "react";
import {
    QuizAttemptDTO,
    QuizPublicationDTO,
    QuestionResponseDTO,
    QuizDTO
} from "@dti-isin/backend-api-client";

export type QuizAttemptLocalContextType = {
    currentAttempt: Partial<QuizAttemptDTO> | null;
    startQuizAttempt: (publication: QuizPublicationDTO, quiz: QuizDTO) => Promise<void>;
    updateQuizAttemptResponses: (responses: QuestionResponseDTO[]) => void;
    completeQuizAttempt: () => Promise<void>;
    resetQuizAttempt: () => void;
    prepareQuizResponses: (quiz: QuizDTO) => QuestionResponseDTO[];
};

export const QuizAttemptLocalContext = createContext<QuizAttemptLocalContextType | undefined>(undefined);