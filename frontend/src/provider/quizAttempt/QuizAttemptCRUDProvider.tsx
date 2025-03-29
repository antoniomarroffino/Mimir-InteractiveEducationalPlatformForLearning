import React, { useMemo } from "react";
import { useMutation } from "react-query";
import { QuizAttemptDTO } from "@dti-isin/backend-api-client";
import { quizAttemptApi } from "../../../config/config.ts";
import { QuizAttemptCRUDContext } from "../../contexts/quizAttempt/QuizAttemptCRUDContext.ts";

export const QuizAttemptCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const createQuizAttemptMutation = useMutation(
        (quizAttemptDTO: QuizAttemptDTO) =>
            quizAttemptApi.apiAttemptsPost({quizAttemptDTO: quizAttemptDTO}).then(response => response.data),
        {
            onError: (error: Error) => {
                console.error("Quiz Attempt creation error:", error);
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
        isCreatingQuizAttempt: createQuizAttemptMutation.isLoading,
        errorCreateQuizAttempt: createQuizAttemptMutation.error,
    }), [createQuizAttemptMutation]);

    return (
        <QuizAttemptCRUDContext.Provider value={value}>
            {children}
        </QuizAttemptCRUDContext.Provider>
    );
};
