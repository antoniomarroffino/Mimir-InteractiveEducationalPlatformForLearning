import React, { useMemo } from "react";
import { QuizDTO } from "@dti-isin/backend-api-client";
import { QuizListContext } from "../../contexts/quiz/QuizListContext.tsx";

export const QuizListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const value = useMemo(() => {
        const getQuizzesForFolder = (folderId: string) => {
            const defaultResult = {
                quizzes: [] as QuizDTO[],
                isLoadingQuizzes: false,
                errorQuizzes: null as Error | null,
                refetchQuizzes: async () => {}
            };

            return folderId ? defaultResult : defaultResult;
        };

        return {
            quizzes: [] as QuizDTO[],
            isLoadingQuizzes: false,
            errorQuizzes: null as Error | null,
            refetchQuizzes: async () => {},
            getQuizzesForFolder
        };
    }, []);

    return (
        <QuizListContext.Provider value={value}>
            {children}
        </QuizListContext.Provider>
    );
};