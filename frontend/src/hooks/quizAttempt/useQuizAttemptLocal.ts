import {useContext} from 'react';
import {QuizAttemptLocalContext} from "../../contexts/quizAttempt/QuizAttemptLocalContext.ts";

export const useQuizAttemptLocal = () => {
    const context = useContext(QuizAttemptLocalContext);
    if (context === undefined) {
        throw new Error('useQuizAttemptLocal must be used within a QuizAttemptLocalProvider');
    }
    return context;
};