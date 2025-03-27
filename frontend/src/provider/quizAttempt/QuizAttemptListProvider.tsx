import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { QuizAttemptDTO } from "@dti-isin/backend-api-client";
import { quizAttemptApi } from "../../../config/config.ts";
import { QuizAttemptListContext } from "../../contexts/quizAttempt/QuizAttemptListContext.ts";

export const QuizAttemptListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentPublicationId, setCurrentPublicationId] = React.useState<string | null>(null);

    const quizAttemptsQuery = useQuery<QuizAttemptDTO[], Error>({
        queryKey: ["quizAttempts", currentPublicationId],
        queryFn: async () => {
            if (!currentPublicationId) return [];
            return (await quizAttemptApi.apiAttemptsByPublicationPublicationIdGet({publicationId: currentPublicationId})).data;
        },
        enabled: !!currentPublicationId
    });

    const getQuizAttemptByIdQuery = useQuery<QuizAttemptDTO, Error>({
        queryKey: ["quizAttempt"],
        queryFn: async () => {
            throw new Error("Attempt ID not set");
        },
        enabled: false
    });

    const value = useMemo(() => ({
        quizAttempts: quizAttemptsQuery.data || [],
        isLoadingQuizAttempts: quizAttemptsQuery.isLoading,
        errorQuizAttempts: quizAttemptsQuery.error,
        fetchQuizAttemptsByPublication: async (publicationId: string) => {
            setCurrentPublicationId(publicationId);
            await quizAttemptsQuery.refetch();
        },
        getQuizAttemptById: async (attemptId: string) => {
            const response = await quizAttemptApi.apiAttemptsAttemptIdGet({attemptId});
            return response.data;
        }
    }), [quizAttemptsQuery]);

    return (
        <QuizAttemptListContext.Provider value={value}>
            {children}
        </QuizAttemptListContext.Provider>
    );
};