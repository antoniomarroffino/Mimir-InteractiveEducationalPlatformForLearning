import React, {useMemo} from "react";
import {QuestionListContext} from "../../contexts/question/QuestionListContext";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";
import {useQuery} from "react-query";
import {QuestionDTO} from "@dti-isin/backend-api-client";
import {questionApi} from "../../../config/config";

export const QuestionListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {selectedCourseId} = useCourseSelection();
    const {selectedFolderId} = useFolderSelection();
    const {selectedQuizId} = useQuizSelection();

    const questionsQuery = useQuery<QuestionDTO[], Error>({
        queryKey: ["questions", selectedCourseId, selectedFolderId, selectedQuizId],
        queryFn: async () => {
            if (!selectedCourseId || !selectedFolderId || !selectedQuizId) return [];

            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId: selectedQuizId
            });

            return response.data;
        },
        enabled: !!selectedCourseId && !!selectedFolderId && !!selectedQuizId
    });

    const value = useMemo(() => {
        // Funzione helper per gestire il caso in cui non siano forniti tutti gli ID
        const validateAndGetQuestions = (
            courseId?: string,
            folderId?: string,
            quizId?: string
        ) => {
            // Se non sono forniti gli ID, restituisci un oggetto con valori di default
            if (!courseId || !folderId || !quizId) {
                return {
                    questions: [],
                    isLoadingQuestions: false,
                    errorQuestions: null,
                    refetchQuestions: async () => {
                    }
                };
            }

            // Altrimenti, restituisci un oggetto con i dati correnti
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