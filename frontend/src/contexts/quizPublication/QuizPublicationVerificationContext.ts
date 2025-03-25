import { createContext } from "react";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

export type QuizPublicationVerificationContextType = {
    currentPublication: QuizPublicationDTO | null;
    isLoadingCurrentPublication: boolean;
    errorCurrentPublication: Error | null;

    verifyQuiz: (accessCode: string) => Promise<void>;
    getPublicationByReferences: (courseId: string, folderId: string, quizId: string) => Promise<QuizPublicationDTO | null>;
    getPublicationByCode: (code: string) => Promise<QuizPublicationDTO | null>;
};

export const QuizPublicationVerificationContext = createContext<QuizPublicationVerificationContextType | undefined>(undefined);