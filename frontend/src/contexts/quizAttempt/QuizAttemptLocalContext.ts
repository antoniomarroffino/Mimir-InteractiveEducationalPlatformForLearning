import {createContext} from "react";
import {QuestionResponseDTO, QuizAttemptDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";

export type QuizAttemptLocalContextType = {
    currentAttempt: Partial<QuizAttemptDTO> | null;
    startQuizAttempt: (publication: QuizPublicationDTO, quizTimeLimit: number | undefined) => Promise<void>;
    updateQuizAttemptResponses: (responses: QuestionResponseDTO[]) => void;
    completeQuizAttempt: (userResponsesOverride?: QuestionResponseDTO[]) => Promise<QuizAttemptDTO>;
    resetQuizAttempt: () => void;
    prepareQuizResponses: (publication: QuizPublicationDTO) => QuestionResponseDTO[];
    clearQuizAttempt: () => void;
    resumeAttempt: (attempt: QuizAttemptDTO, publication: QuizPublicationDTO) => void;
};

export const QuizAttemptLocalContext = createContext<QuizAttemptLocalContextType | undefined>(undefined);