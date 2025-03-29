import React, {useCallback, useState} from 'react';
import {quizApi} from "../../config/config";
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {QuizRetrieveContext, QuizRetrieveContextType} from '../contexts/QuizRetrieveContext';
import {useQuizPublicationVerification} from '../hooks/quizPublication/useQuizPublicationVerification';

interface QuizRetrieveProviderProps {
    children: React.ReactNode;
}

export const QuizRetrieveProvider: React.FC<QuizRetrieveProviderProps> = ({children}) => {
    const {currentPublication} = useQuizPublicationVerification();
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [quizPublication, setQuizPublication] = useState<QuizPublicationDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const retrieveQuiz = useCallback(async (publication?: QuizPublicationDTO) => {
        const pubToUse = publication || currentPublication;

        if (!pubToUse) {
            setQuiz(null);
            setQuizPublication(null);
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet({
                courseId: pubToUse.courseId,
                folderId: pubToUse.folderId,
                quizId: pubToUse.quizId
            });

            // Salva sia il quiz che la pubblicazione
            setQuiz(response.data);
            setQuizPublication(pubToUse);
            setIsLoading(false);
            return response.data;
        } catch (err) {
            setError(err as Error);
            setQuiz(null);
            setQuizPublication(null);
            setIsLoading(false);
            return null;
        }
    }, [currentPublication]);

    const resetQuiz = useCallback(() => {
        setQuiz(null);
        setQuizPublication(null);
        setIsLoading(false);
        setError(null);
    }, []);

    const value: QuizRetrieveContextType = {
        quiz,
        quizPublication,
        isLoading,
        error,
        retrieveQuiz,
        resetQuiz
    };

    return (
        <QuizRetrieveContext.Provider value={value}>
            {children}
        </QuizRetrieveContext.Provider>
    );
};