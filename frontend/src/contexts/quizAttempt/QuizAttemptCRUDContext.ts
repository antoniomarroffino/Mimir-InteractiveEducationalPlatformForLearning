import {createContext} from "react";
import {BadgeType, QuizAttemptDTO} from "@dti-isin/backend-api-client";

export type QuizAttemptCRUDContextType = {
    createQuizAttempt: (quizAttemptDTO: QuizAttemptDTO) => Promise<QuizAttemptDTO>;
    getQuizAttemptById: (attemptId: string) => Promise<QuizAttemptDTO>;
    getQuizAttemptsByPublication: (publicationId: string) => Promise<QuizAttemptDTO[]>;
    assignBadge: (attemptId: string, badgeType: BadgeType) => Promise<void>;
    isAssigningBadge: boolean;
    errorAssignBadge: Error | null;
    isCreatingQuizAttempt: boolean;
    isLoadingAttempt: boolean;
    errorCreateQuizAttempt: Error | null;
    errorLoadAttempt: Error | null;
};

export const QuizAttemptCRUDContext = createContext<QuizAttemptCRUDContextType | undefined>(undefined);