import React, { useMemo } from "react";
import {useMutation, useQueryClient} from "react-query";
import { QuizAttemptDTO, BadgeType } from "@dti-isin/backend-api-client";
import { quizAttemptApi } from "../../../config/config.ts";
import { QuizAttemptCRUDContext } from "../../contexts/quizAttempt/QuizAttemptCRUDContext.ts";

interface AssignBadgeParams {
    attemptId: string;
    badgeType: BadgeType;
}


export const QuizAttemptCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();
    const createQuizAttemptMutation = useMutation(
        (quizAttemptDTO: QuizAttemptDTO) =>
            quizAttemptApi.apiAttemptsPost({ quizAttemptDTO })
                .then(response => response.data),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['quizAttempts', data.quizPublicationId]);
                queryClient.setQueryData(
                    ['quizAttempts', data.quizPublicationId],
                    (oldData: QuizAttemptDTO[] | undefined) => {
                        if (!oldData) return [data];
                        return [...oldData, data];
                    }
                );
            }
        }
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

    const assignBadgeMutation = useMutation(
        ({ attemptId, badgeType }: AssignBadgeParams) =>
            quizAttemptApi.apiAttemptsAttemptIdBadgesPost({
                attemptId,
                type: badgeType
            }),
        {
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(['quizAttempt', variables.attemptId]);
                queryClient.invalidateQueries(['quizAttempts']);
            }
        }
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
        assignBadge: async (attemptId: string, badgeType: BadgeType) => {
            try {
                await assignBadgeMutation.mutateAsync({ attemptId, badgeType });
            } catch (err) {
                console.error("Failed to assign badge:", err);
                throw err;
            }
        },
        isCreatingQuizAttempt: createQuizAttemptMutation.isLoading,
        isLoadingAttempt: getQuizAttemptByIdQuery.isLoading || getQuizAttemptsByPublicationQuery.isLoading,
        isAssigningBadge: assignBadgeMutation.isLoading,
        errorCreateQuizAttempt: createQuizAttemptMutation.error as Error,
        errorLoadAttempt: getQuizAttemptByIdQuery.error as Error || getQuizAttemptsByPublicationQuery.error as Error,
        errorAssignBadge: assignBadgeMutation.error as Error,
    }), [createQuizAttemptMutation, getQuizAttemptByIdQuery, assignBadgeMutation, getQuizAttemptsByPublicationQuery]);

    return (
        <QuizAttemptCRUDContext.Provider value={value}>
            {children}
        </QuizAttemptCRUDContext.Provider>
    );
};
