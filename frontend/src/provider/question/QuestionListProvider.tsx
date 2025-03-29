import React, {useMemo} from "react";
import {QuestionListContext} from "../../contexts/question/QuestionListContext";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";
import {useQuery} from "react-query";
import {QuestionDTO} from "@dti-isin/backend-api-client";

export const QuestionListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {selectedCourseId} = useCourseSelection();
    const {selectedFolderId} = useFolderSelection();
    const {selectedQuizId} = useQuizSelection();

    const questionsQuery = useQuery<QuestionDTO[], Error>({
        queryKey: ["questions", selectedCourseId, selectedFolderId, selectedQuizId],
        queryFn: async () => {
            if (!selectedCourseId || !selectedFolderId || !selectedQuizId) return [];

            /*const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId: selectedQuizId
            });

            return response.data;*/
            return [];
        },
        enabled: !!selectedCourseId && !!selectedFolderId && !!selectedQuizId
    });

    const value = useMemo(() => {
        const validateAndGetQuestions = (
            courseId?: string,
            folderId?: string,
            quizId?: string
        ) => {
            if (!courseId || !folderId || !quizId) {
                return {
                    questions: [],
                    isLoadingQuestions: false,
                    errorQuestions: null,
                    refetchQuestions: async () => {
                    }
                };
            }

            return {
                questions: questionsQuery.data || [],
                isLoadingQuestions: questionsQuery.isLoading,
                errorQuestions: questionsQuery.error,
                refetchQuestions: async () => {
                    await questionsQuery.refetch();
                }
            };
        };

        return {
            questions: questionsQuery.data || [],
            isLoadingQuestions: questionsQuery.isLoading,
            errorQuestions: questionsQuery.error || null,

            getQuestionsForQuiz: validateAndGetQuestions,

            refetchQuestions: async () => {
                await questionsQuery.refetch();
            },
            getQuestionCount: () => questionsQuery.data?.length || 0
        };
    }, [questionsQuery]);

    return (
        <QuestionListContext.Provider value={value}>
            {children}
        </QuestionListContext.Provider>
    );
};