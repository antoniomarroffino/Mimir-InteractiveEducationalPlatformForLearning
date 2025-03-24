import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { QuestionDTO } from "@dti-isin/backend-api-client";
import { QuestionListContext } from "../../contexts/question/QuestionListContext";
import { questionApi } from "../../../config/config";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";

export const QuestionListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {selectedCourseId} = useCourseSelection();
    const {selectedFolderId} = useFolderSelection();
    const {selectedQuizId} = useQuizSelection();

    const questionsQuery = useQuery<QuestionDTO[], Error>(
        ["questions", selectedCourseId, selectedFolderId, selectedQuizId],
        async () => {
            if (!selectedCourseId || !selectedFolderId || !selectedQuizId) return [];
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId: selectedQuizId});
            return response.data;
        },
        {
            enabled: !!selectedCourseId && !!selectedFolderId && !!selectedQuizId,
        }
    );

    const value = useMemo(() => ({
            questions: questionsQuery.data || [],
            isLoadingQuestions: questionsQuery.isLoading,
            errorQuestions: questionsQuery.error || null,
            fetchQuestions: async () => {
                await questionsQuery.refetch();
            },
        }),
        [questionsQuery]
    );

    return <QuestionListContext.Provider value={value}>{children}</QuestionListContext.Provider>;
};
