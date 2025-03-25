import React, {useMemo} from "react";
import {useQuery} from "react-query";
import {QuestionDTO} from "@dti-isin/backend-api-client";
import {QuestionListContext} from "../../contexts/question/QuestionListContext";
import {questionApi} from "../../../config/config";

export const QuestionListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const questionsQuery = useQuery<QuestionDTO[], Error>({
        queryKey: ["questions"],
        queryFn: async (context) => {
            // Estrai gli ID dalla query key
            const [, courseId, folderId, quizId] = context.queryKey;

            if (!courseId || !folderId || !quizId) return [];

            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId: courseId as string,
                folderId: folderId as string,
                quizId: quizId as string
            });

            return response.data;
        },
        // Rimuovi enabled basato sugli ID selezionati
        enabled: false,
        keepPreviousData: true
    });

    const value = useMemo(() => ({
        questions: questionsQuery.data || [],
        isLoadingQuestions: questionsQuery.isLoading,
        errorQuestions: questionsQuery.error || null,
        fetchQuestions: async (
            courseId: string,
            folderId: string,
            quizId: string
        ) => {
            if (!courseId || !folderId || !quizId) {
                throw new Error("Missing required IDs");
            }

            return await questionsQuery.refetch({
                queryKey: ["questions", courseId, folderId, quizId]
            });
        },
        getQuestionCount: () => questionsQuery.data?.length || 0
    }), [questionsQuery]);

    return (
        <QuestionListContext.Provider value={value}>
            {children}
        </QuestionListContext.Provider>
    );
};