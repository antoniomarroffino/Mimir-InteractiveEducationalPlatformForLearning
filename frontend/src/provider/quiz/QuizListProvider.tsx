import React, {useMemo} from "react";
import {useQuery} from "react-query";
import {QuizDTO} from "@dti-isin/backend-api-client";
import {quizApi} from "../../../config/config.ts";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {QuizListContext} from "../../contexts/quiz/QuizListContext.tsx";

export const QuizListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {selectedCourseId} = useCourseSelection();

    const fetchQuizzes = async (folderId: string) => {
        if (!selectedCourseId || !folderId) return [];

        const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
            courseId: selectedCourseId,
            folderId
        });

        return response.data;
    };

    const value = useMemo(() => {
        return {
            getQuizzes: (folderId: string) => {
                const quizzesQuery = useQuery<QuizDTO[], Error>({
                    queryKey: ["quizzes", selectedCourseId, folderId],
                    queryFn: () => fetchQuizzes(folderId),
                    enabled: !!selectedCourseId && !!folderId,
                    keepPreviousData: true
                });

                return {
                    quizzes: quizzesQuery.data || [],
                    isLoadingQuizzes: quizzesQuery.isLoading,
                    errorQuizzes: quizzesQuery.error,
                    refetchQuizzes: quizzesQuery.refetch
                };
            }
        };
    }, [selectedCourseId]);

    return (
        <QuizListContext.Provider value={value}>
            {children}
        </QuizListContext.Provider>
    );
};