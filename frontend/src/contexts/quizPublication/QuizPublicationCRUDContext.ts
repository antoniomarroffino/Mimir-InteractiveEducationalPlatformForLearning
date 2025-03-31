import {createContext} from "react";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";

type CreateQuizPublicationDTO = Omit<QuizPublicationDTO, 'id' | 'publicationCode'>;

export type QuizPublicationCRUDContextType = {
    createPublication: (data: CreateQuizPublicationDTO) => Promise<QuizPublicationDTO>;
    updatePublication: (data: QuizPublicationDTO) => Promise<QuizPublicationDTO>;
    deletePublication: (id: string) => Promise<void>;
    deactivatePublication: (id: string) => Promise<QuizPublicationDTO>;

    isCreatingPublication: boolean;
    isUpdatingPublication: boolean;
    isDeletingPublication: boolean;
    isDeactivatingPublication: boolean;

    errorCreatePublication: Error | null;
    errorUpdatePublication: Error | null;
    errorDeletePublication: Error | null;
    errorDeactivatePublication: Error | null;
};

export const QuizPublicationCRUDContext = createContext<QuizPublicationCRUDContextType | undefined>(undefined);