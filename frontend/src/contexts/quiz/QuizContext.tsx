import { createContext, useContext } from 'react';
import { QuizDTO } from '@dti-isin/backend-api-client';

interface QuizContextType {
    quizzes: QuizDTO[];
    isLoading: boolean;
    error: Error | null;
    createQuiz: (name: string) => Promise<void>;
    selectedQuizId: string | null;
    setSelectedQuizId: (id: string | null) => void;
    fetchQuizzes: () => Promise<void>;
}

export const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuizContext = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuizContext must be used within a QuizProvider');
    }
    return context;
};