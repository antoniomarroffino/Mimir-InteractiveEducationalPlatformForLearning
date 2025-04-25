import React, {useMemo} from "react";
import {useMutation, useQueryClient} from "react-query";
import {BadgeType, QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {quizAttemptApi} from "../../../config/config.ts";
import {QuizAttemptCRUDContext} from "../../contexts/quizAttempt/QuizAttemptCRUDContext.ts";

interface AssignBadgeParams {
    attemptId: string;
    badgeType: BadgeType;
}

export const QuizAttemptCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();
    const createQuizAttemptMutation = useMutation(
        (quizAttemptDTO: QuizAttemptDTO) =>
            quizAttemptApi.apiAttemptsPost({quizAttemptDTO})
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

    const submitAttemptMutation = useMutation(
        ({attemptId, quizAttemptDTO}: { attemptId: string, quizAttemptDTO: QuizAttemptDTO }) =>
            quizAttemptApi.apiAttemptsAttemptIdSubmitPost({
                attemptId,
                quizAttemptDTO
            }).then(res => res.data),
        {
            onSuccess: (attempt) => {
                queryClient.invalidateQueries(['quizAttempts']);
                queryClient.invalidateQueries(['quizAttemptRecovered', attempt.user?.azureOid, attempt.quizPublicationId])
            }
        }
    );

    const assignBadgeMutation = useMutation(
        ({attemptId, badgeType}: AssignBadgeParams) =>
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

    const updateAttemptPartialMutation = useMutation(
        ({attemptId, quizAttemptDTO}: { attemptId: string, quizAttemptDTO: QuizAttemptDTO }) =>
            quizAttemptApi.apiAttemptsAttemptIdPatch({
                attemptId,
                quizAttemptDTO
            }).then(res => res.data),
        {
            onSuccess: (attempt, {attemptId}) => {
                queryClient.invalidateQueries(['quizAttempt', attemptId]);
                queryClient.invalidateQueries(['quizAttemptRecovered', attempt.user?.azureOid, attempt.quizPublicationId])
            }
        }
    );


    const value = useMemo(() => ({
        createInitialAttempt: async (quizAttemptDTO: QuizAttemptDTO) => {
            try {
                return await createQuizAttemptMutation.mutateAsync(quizAttemptDTO);
            } catch (err) {
                console.error("Quiz Attempt creation failed:", err);
                throw err;
            }
        },
        submitAttemptFinal: async (attemptId: string, quizAttemptDTO: QuizAttemptDTO): Promise<QuizAttemptDTO> => {
            try {
                return await submitAttemptMutation.mutateAsync({attemptId, quizAttemptDTO});
            } catch (err) {
                console.error("Final submission of Quiz Attempt failed:", err);
                throw err;
            }
        },
        assignBadge: async (attemptId: string, badgeType: BadgeType) => {
            try {
                await assignBadgeMutation.mutateAsync({attemptId, badgeType});
            } catch (err) {
                console.error("Failed to assign badge:", err);
                throw err;
            }
        },
        updateAttemptPartial: async (attemptId: string, quizAttemptDTO: QuizAttemptDTO): Promise<QuizAttemptDTO> => {
            try {
                return await updateAttemptPartialMutation.mutateAsync({attemptId, quizAttemptDTO});
            } catch (err) {
                console.error("Partial update of Quiz Attempt failed:", err);
                throw err;
            }
        },
        isCreatingQuizAttempt: createQuizAttemptMutation.isLoading,
        isAssigningBadge: assignBadgeMutation.isLoading,
        errorCreateQuizAttempt: createQuizAttemptMutation.error as Error,
        errorAssignBadge: assignBadgeMutation.error as Error,
    }), [createQuizAttemptMutation, assignBadgeMutation, submitAttemptMutation, updateAttemptPartialMutation]);

    return (
        <QuizAttemptCRUDContext.Provider value={value}>
            {children}
        </QuizAttemptCRUDContext.Provider>
    );
};
