import React, {useMemo} from "react";
import {useQuery} from "react-query";
import {QuizDTO} from "@dti-isin/backend-api-client";
import {quizApi} from "../../../config/config";
import {QuizListContext} from "../../contexts/quiz/QuizListContext.tsx";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";

export const QuizListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {selectedCourseId} = useCourseSelection();
    const {selectedFolderId} = useFolderSelection();

    const quizzesQuery = useQuery<QuizDTO[], Error>({
        queryKey: ["quizzes", selectedCourseId, selectedFolderId],
        queryFn: async () => {
            if (!selectedCourseId || !selectedFolderId) return [];
            return (await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId: selectedCourseId,
                folderId: selectedFolderId
            })).data;
        },
        enabled: !!selectedCourseId && !!selectedFolderId,
    });

    const value = useMemo(() => ({
            quizzes: quizzesQuery.data || [],
            isLoadingQuizzes: quizzesQuery.isLoading,
            errorQuizzes: quizzesQuery.error,
            fetchQuizzes: async () => {
                await quizzesQuery.refetch();
            },
        }), [quizzesQuery]
    );

    return <QuizListContext.Provider value={value}>{children}</QuizListContext.Provider>;
};
