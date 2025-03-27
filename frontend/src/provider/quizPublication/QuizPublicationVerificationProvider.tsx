import React, {useState} from "react";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {quizPublicationApi} from "../../../config/config.ts";
import {QuizPublicationVerificationContext} from "../../contexts/quizPublication/QuizPublicationVerificationContext.ts";

export const QuizPublicationVerificationProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentPublication, setCurrentPublication] = useState<QuizPublicationDTO | null>(null);
    const [isLoadingCurrentPublication, setIsLoadingCurrentPublication] = useState<boolean>(false);
    const [errorCurrentPublication, setErrorCurrentPublication] = useState<Error | null>(null);

    const verifyQuiz = async (accessCode: string) => {
        setIsLoadingCurrentPublication(true);
        setErrorCurrentPublication(null);
        try {
            const response = await quizPublicationApi.apiPublicationsByCodeCodeGet({code: accessCode});
            setCurrentPublication(response.data);
        } catch (error) {
            setErrorCurrentPublication(error as Error);
            setCurrentPublication(null);
        } finally {
            setIsLoadingCurrentPublication(false);
        }
    };

    const getPublicationByReferences = async (courseId: string, folderId: string, quizId: string) => {
        try {
            const response = await quizPublicationApi.apiPublicationsByReferencesCourseIdFolderIdQuizIdGet({
                courseId,
                folderId,
                quizId
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching publication:", error);
            return null;
        }
    };

    const getPublicationByCode = async (code: string) => {
        try {
            const response = await quizPublicationApi.apiPublicationsByCodeCodeGet({code});
            return response.data;
        } catch (error) {
            console.error("Error fetching publication by code:", error);
            return null;
        }
    };

    const value = {
        currentPublication,
        isLoadingCurrentPublication,
        errorCurrentPublication,
        verifyQuiz,
        getPublicationByReferences,
        getPublicationByCode,
    };

    return (
        <QuizPublicationVerificationContext.Provider value={value}>
            {children}
        </QuizPublicationVerificationContext.Provider>
    );
};