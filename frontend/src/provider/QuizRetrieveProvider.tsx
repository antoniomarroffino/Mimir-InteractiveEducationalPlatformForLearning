import React, {useState} from 'react';
import {quizApi} from "../../config/config";
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {QuizRetrieveContext, QuizRetrieveContextType} from '../contexts/QuizRetrieveContext';

interface QuizRetrieveProviderProps {
    children: React.ReactNode;
}

export const QuizRetrieveProvider: React.FC<QuizRetrieveProviderProps> = ({children}) => {
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [quizPublication, setQuizPublication] = useState<QuizPublicationDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const retrieveQuiz = async (publication: QuizPublicationDTO) => {
        if (publication == null) return;
        setIsLoading(true);
        setError(null);
        try {
            setQuizPublication(publication);

            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet({
                courseId: publication.courseId,
                folderId: publication.folderId,
                quizId: publication.quizId
            });
            setQuiz(response.data);
        } catch (err) {
            setError(err as Error);
            setQuizPublication(null);
        } finally {
            setIsLoading(false);
        }
    };

    const value: QuizRetrieveContextType = {
        quiz,
        quizPublication,
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