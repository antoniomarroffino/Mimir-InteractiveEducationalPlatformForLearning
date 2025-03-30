import React, { useMemo, useState } from 'react';
import { QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { QuizPublicationSelectionContext } from '../../contexts/quizPublication/QuizPublicationSelectionContext';

export const QuizPublicationSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedPublication, setSelectedPublication] = useState<QuizPublicationDTO | null>(null);

    const value = useMemo(() => ({
        selectedPublication,
        setSelectedPublication,
        deselectPublication: () => {
            setSelectedPublication(null);
        }
    }), [selectedPublication]);

    return (
        <QuizPublicationSelectionContext.Provider value={value}>
            {children}
        </QuizPublicationSelectionContext.Provider>
    );
};