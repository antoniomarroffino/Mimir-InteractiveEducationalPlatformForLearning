import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { QuizDTO } from "@dti-isin/backend-api-client";
import {quizApi} from "../../../config/config";
import {QuizListContext} from "../../contexts/quiz/QuizListContext.tsx";

export const QuizListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [params, setParams] = useState<{ courseId?: string; folderId?: string }>({});

    const quizzesQuery = useQuery<QuizDTO[], Error>(
        ["quizzes", params.courseId, params.folderId],
        async () => {
            if (!params.courseId || !params.folderId) return [];
            return (await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId: params.courseId,
                folderId: params.folderId})).data;
        },
        {
            enabled: Boolean(params.courseId && params.folderId),
        }
    );

    const fetchQuizzes = useCallback(async () => {
        setParams({ courseId: params.courseId, folderId: params.folderId });
        await quizzesQuery.refetch();
    }, [params.courseId, params.folderId, quizzesQuery]);

    const value = useMemo(() => ({
            quizzes: quizzesQuery.data || [],
            isLoadingQuizzes: quizzesQuery.isLoading,
            errorQuizzes: quizzesQuery.error,
            fetchQuizzes,
        }),
        [quizzesQuery.data, quizzesQuery.isLoading, quizzesQuery.error, fetchQuizzes]
    );

    return <QuizListContext.Provider value={value}>{children}</QuizListContext.Provider>;
};
