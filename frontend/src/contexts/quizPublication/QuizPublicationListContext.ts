import { createContext } from "react";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

export type QuizPublicationListContextType = {
    publications: QuizPublicationDTO[];
    isLoadingPublications: boolean;
    errorPublications: Error | null;
    fetchPublications: () => void;
};

export const QuizPublicationListContext = createContext<QuizPublicationListContextType | undefined>(undefined);