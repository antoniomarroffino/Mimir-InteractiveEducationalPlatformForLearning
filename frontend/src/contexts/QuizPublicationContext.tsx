import { createContext } from "react";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";

export type QuizPublicationContextType = {
    publications: QuizPublicationDTO[];
    isLoadingPublications: boolean;
    errorPublications: Error | null;
    createPublication: (dto: Omit<QuizPublicationDTO, 'id' | 'publicationCode'>) => Promise<QuizPublicationDTO>;
    fetchPublications: () => Promise<void>;
    getPublicationByReferences: (courseId: string, folderId: string, quizId: string) => Promise<QuizPublicationDTO | null>;
    isCreatingPublication: boolean;
    errorCreatePublication: Error | null;
};

export const QuizPublicationContext = createContext<QuizPublicationContextType | undefined>(undefined);