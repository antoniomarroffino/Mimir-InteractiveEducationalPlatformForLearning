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
        assignBadge: async (attemptId: string, badgeType: BadgeType) => {
            try {
                await assignBadgeMutation.mutateAsync({ attemptId, badgeType });
            } catch (err) {
                console.error("Failed to assign badge:", err);
                throw err;
            }
        },
        isCreatingQuizAttempt: createQuizAttemptMutation.isLoading,
        isAssigningBadge: assignBadgeMutation.isLoading,
        errorCreateQuizAttempt: createQuizAttemptMutation.error as Error,
        errorAssignBadge: assignBadgeMutation.error as Error,
    }), [createQuizAttemptMutation, assignBadgeMutation]);

    return (
        <QuizAttemptCRUDContext.Provider value={value}>
            {children}
        </QuizAttemptCRUDContext.Provider>
    );
};
