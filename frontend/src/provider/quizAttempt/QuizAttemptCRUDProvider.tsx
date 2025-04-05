import React, { useMemo } from "react";
import { useMutation } from "react-query";
import { QuizAttemptDTO } from "@dti-isin/backend-api-client";
import { quizAttemptApi } from "../../../config/config.ts";
import { QuizAttemptCRUDContext } from "../../contexts/quizAttempt/QuizAttemptCRUDContext.ts";

export const QuizAttemptCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const createQuizAttemptMutation = useMutation(
        (quizAttemptDTO: QuizAttemptDTO) =>
            quizAttemptApi.apiAttemptsPost({quizAttemptDTO: quizAttemptDTO})
                .then(response => response.data)
    );

    const getQuizAttemptByIdQuery = useMutation(
        (attemptId: string) =>
            quizAttemptApi.apiAttemptsAttemptIdGet({attemptId})
                .then(response => response.data)
    );

    const getQuizAttemptsByPublicationQuery = useMutation(
        (publicationId: string) =>
            quizAttemptApi.apiAttemptsByPublicationPublicationIdGet({publicationId})
                .then(response => response.data)
    );

    const value = useMemo(() => ({
        createQuizAttempt: async (quizAttemptDTO: QuizAttemptDTO) => {
            try {
                return await createQuizAttemptMutation.mutateAsync(quizAttemptDTO);
            } catch (err) {
                console.error("Quiz Attempt creation failed:", err);
                throw err;
            }
        },
        getQuizAttemptById: async (attemptId: string) => {
            try {
                return await getQuizAttemptByIdQuery.mutateAsync(attemptId);
            } catch (err) {
                console.error("Failed to fetch quiz attempt:", err);
                throw err;
            }
        },
        getQuizAttemptsByPublication: async (publicationId: string) => {
            try {
                return await getQuizAttemptsByPublicationQuery.mutateAsync(publicationId);
            } catch (err) {
                console.error("Failed to fetch quiz attempts by publication:", err);
                throw err;
            }
        },
        isCreatingQuizAttempt: createQuizAttemptMutation.isLoading,
        isLoadingAttempt: getQuizAttemptByIdQuery.isLoading || getQuizAttemptsByPublicationQuery.isLoading,
        errorCreateQuizAttempt: createQuizAttemptMutation.error as Error,
        errorLoadAttempt: getQuizAttemptByIdQuery.error as Error || getQuizAttemptsByPublicationQuery.error as Error,
    }), [createQuizAttemptMutation, getQuizAttemptByIdQuery, getQuizAttemptsByPublicationQuery]);

    return (
        <QuizAttemptCRUDContext.Provider value={value}>
            {children}
        </QuizAttemptCRUDContext.Provider>
    );
};
