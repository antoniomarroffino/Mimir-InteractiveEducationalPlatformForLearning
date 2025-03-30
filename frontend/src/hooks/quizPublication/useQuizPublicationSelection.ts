import {useContext} from 'react';
import {QuizPublicationSelectionContext} from '../../contexts/quizPublication/QuizPublicationSelectionContext';

export const useQuizPublicationSelection = () => {
    const context = useContext(QuizPublicationSelectionContext);

    if (!context) {
        throw new Error('useQuizPublicationSelection must be used within a QuizPublicationSelectionProvider');
    }

    return context;
};