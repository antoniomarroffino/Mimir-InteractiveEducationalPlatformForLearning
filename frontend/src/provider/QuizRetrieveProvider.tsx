import React, { useState } from 'react';
import { quizApi } from "../../config/config";
import { QuizDTO } from "@dti-isin/backend-api-client";
import { QuizRetrieveContext, QuizRetrieveContextType } from '../contexts/QuizRetrieveContext';

interface QuizRetrieveProviderProps {
    children: React.ReactNode;
}

export const QuizRetrieveProvider: React.FC<QuizRetrieveProviderProps> = ({ children }) => {
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const retrieveQuiz = async (courseId: string, folderId: string, quizId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet({
                courseId,
                folderId,
                quizId
            });
            setQuiz(response.data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const value: QuizRetrieveContextType = {
        quiz,
        isLoading,
        error,
        retrieveQuiz
    };

    return (
        <QuizRetrieveContext.Provider value={value}>
            {children}
        </QuizRetrieveContext.Provider>
    );
};