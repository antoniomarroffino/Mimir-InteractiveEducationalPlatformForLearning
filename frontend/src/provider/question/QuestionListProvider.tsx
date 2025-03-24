import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { QuestionDTO } from "@dti-isin/backend-api-client";
import { QuestionListContext } from "../../contexts/question/QuestionListContext";
import { questionApi } from "../../../config/config";

export const QuestionListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [params, setParams] = useState<{ courseId?: string; folderId?: string; quizId?: string }>({});

    const questionsQuery = useQuery<QuestionDTO[], Error>(
        ["questions", params.courseId, params.folderId, params.quizId],
        async () => {
            if (!params.courseId || !params.folderId || !params.quizId) return [];
            return (await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId: params.courseId,
                folderId: params.folderId,
                quizId: params.quizId}))
                .data;
        },
        {
            enabled: Boolean(params.courseId && params.folderId && params.quizId),
        }
    );

    const fetchQuestions = useCallback(async (courseId: string, folderId: string, quizId: string) => {
        setParams({ courseId, folderId, quizId });
        await questionsQuery.refetch();
    }, [questionsQuery]);

    const value = useMemo(
        () => ({
            questions: questionsQuery.data || [],
            isLoadingQuestions: questionsQuery.isLoading,
            errorQuestions: questionsQuery.error,
            fetchQuestions,
        }),
        [questionsQuery.data, questionsQuery.isLoading, questionsQuery.error, fetchQuestions]
    );

    return <QuestionListContext.Provider value={value}>{children}</QuestionListContext.Provider>;
};
