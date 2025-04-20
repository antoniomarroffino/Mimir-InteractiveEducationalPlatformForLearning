import {createContext} from "react";
import {BadgeType, QuizAttemptDTO} from "@dti-isin/backend-api-client";

export type QuizAttemptCRUDContextType = {
    createInitialAttempt: (quizAttemptDTO: QuizAttemptDTO) => Promise<QuizAttemptDTO>;
    submitAttemptFinal: (attemptId: string, quizAttemptDTO: QuizAttemptDTO) => Promise<QuizAttemptDTO>;
    assignBadge: (attemptId: string, badgeType: BadgeType) => Promise<void>;
    isAssigningBadge: boolean;
    errorAssignBadge: Error | null;
    isCreatingQuizAttempt: boolean;
    errorCreateQuizAttempt: Error | null;
    updateAttemptPartial: (attemptId: string, quizAttemptDTO: QuizAttemptDTO) => Promise<QuizAttemptDTO>;

};


export const QuizAttemptCRUDContext = createContext<QuizAttemptCRUDContextType | undefined>(undefined);