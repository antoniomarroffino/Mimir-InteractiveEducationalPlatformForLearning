import { createContext } from 'react';
import { QuizPublicationDTO } from '@dti-isin/backend-api-client';

export interface QuizPublicationSelectionContextType {
    selectedPublication: QuizPublicationDTO | null;
    setSelectedPublication: (publication: QuizPublicationDTO | null) => void;
    deselectPublication: () => void;
}

export const QuizPublicationSelectionContext = createContext<QuizPublicationSelectionContextType>({
    selectedPublication: null,
    setSelectedPublication: () => {},
    deselectPublication: () => {}
});