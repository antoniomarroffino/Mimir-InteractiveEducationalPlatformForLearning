import {createContext} from "react";
import {BadgeType, QuizAttemptDTO} from "@dti-isin/backend-api-client";

export type QuizAttemptCRUDContextType = {
    createQuizAttempt: (quizAttemptDTO: QuizAttemptDTO) => Promise<QuizAttemptDTO>;
    assignBadge: (attemptId: string, badgeType: BadgeType) => Promise<void>;
    isAssigningBadge: boolean;
    errorAssignBadge: Error | null;
    isCreatingQuizAttempt: boolean;
    errorCreateQuizAttempt: Error | null;
};

export const QuizAttemptCRUDContext = createContext<QuizAttemptCRUDContextType | undefined>(undefined);