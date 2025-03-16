import { useContext } from 'react';
import { QuestionContext } from '../contexts/QuestionContext';

export const useQuestion = () => {
    const context = useContext(QuestionContext);
    if (context === undefined) {
        throw new Error('useQuestion must be used within a QuestionProvider');
    }
    return context;
};