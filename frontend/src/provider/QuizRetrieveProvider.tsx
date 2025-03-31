import React, {useCallback, useState} from 'react';
import {quizApi} from "../../config/config";
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {QuizRetrieveContext, QuizRetrieveContextType} from '../contexts/QuizRetrieveContext';

export const QuizRetrieveProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [quizPublication, setQuizPublication] = useState<QuizPublicationDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const retrieveQuiz = async (publication: QuizPublicationDTO) => {
        if (!publication) {
            setQuiz(null);
            setQuizPublication(null);
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet({
                courseId: publication.courseId,
                folderId: publication.folderId,
                quizId: publication.quizId
            });

            setQuiz(response.data);
            setQuizPublication(publication);
            setIsLoading(false);
            return response.data;
        } catch (err) {
            setError(err as Error);
            setQuiz(null);
            setQuizPublication(null);
            setIsLoading(false);
            return null;
        }
    };

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