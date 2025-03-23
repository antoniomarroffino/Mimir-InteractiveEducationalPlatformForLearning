import React, {useState} from 'react';
import {quizApi} from "../../config/config";
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {QuizRetrieveContext, QuizRetrieveContextType} from '../contexts/QuizRetrieveContext';

interface QuizRetrieveProviderProps {
    children: React.ReactNode;
}

export const QuizRetrieveProvider: React.FC<QuizRetrieveProviderProps> = ({children}) => {
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const retrieveQuiz = async (quizPublication: QuizPublicationDTO) => {
        if (quizPublication == null) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet({
                courseId: quizPublication.courseId,
                folderId: quizPublication.folderId,
                quizId: quizPublication.quizId
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