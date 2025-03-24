import React from "react";
import {useMutation, useQueryClient} from "react-query";
import {QuestionDTO, QuestionType} from "@dti-isin/backend-api-client";
import {QuestionCRUDContext} from "../../contexts/question/QuestionCRUDContext.ts";
import {questionApi} from "../../../config/config.ts";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";
import {useQuestionSelection} from "../../hooks/question/useQuestionSelection.ts";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";

export const QuestionCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();
    const {selectedCourseId} = useCourseSelection();
    const {selectedFolderId} = useFolderSelection();
    const {selectedQuizId} = useQuizSelection();
    const {deselectQuestion} = useQuestionSelection();

    const createQuestionMutation = useMutation(
        async (questionDTO: QuestionDTO) => {
            if (!selectedCourseId || !selectedFolderId || !selectedQuizId) {
                throw new Error("No course, folder, or quiz selected");
            }
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsPost({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId: selectedQuizId,
                questionDTO,
            });
            return response.data;
        },
        {
            onSuccess: (newQuestion) => {
                queryClient.setQueryData(
                    ["questions", selectedCourseId, selectedFolderId, selectedQuizId],
                    (oldData: QuestionDTO[] | undefined) => (oldData ? [...oldData, newQuestion] : [newQuestion])
                );
            }, onError: (error: Error) => {
                console.error("Question creation error:", error);
            }
        }
    );

    const updateQuestionMutation = useMutation(
        async ({questionId, questionDTO}: { questionId: string, questionDTO: QuestionDTO }) => {
            if (!selectedCourseId || !selectedFolderId || !selectedQuizId || !questionId) {
                throw new Error("Missing required parameters");
            }
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsQuestionIdPut({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId: selectedQuizId,
                questionId,
                questionDTO,
            });
            return response.data;
        },
        {
            onSuccess: (updatedQuestion) => {
                queryClient.setQueryData(
                    ["questions", selectedCourseId, selectedFolderId, selectedQuizId],
                    (oldData: QuestionDTO[] | undefined) => {
                        if (!oldData) return [updatedQuestion];
                        return oldData.map((question) =>
                            question.id === updatedQuestion.id ? updatedQuestion : question
                        );
                    }
                );
            }, onError: (error: Error) => {
                console.error("Question updating error:", error);
            }
        }
    );

    const deleteQuestionMutation = useMutation(
        async (questionId: string) => {
            if (!selectedCourseId || !selectedFolderId || !selectedQuizId || !questionId) {
                throw new Error("Missing required parameters");
            }
            return questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsQuestionIdDelete({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId: selectedQuizId,
                questionId,
            });
        },
        {
            onSuccess: (_, questionId) => {
                queryClient.setQueryData<QuestionDTO[]>(
                    ["questions", selectedCourseId, selectedFolderId, selectedQuizId],
                    (old) => old?.filter(q => q.id !== questionId) || []
                );
                deselectQuestion();
            }, onError: (error: Error) => {
                console.error("Question delete error:", error);
            }
        }
    );

    const createQuestionTemplateMutation = useMutation(
        async (questionType: QuestionType) => {
            if (!questionType) {
                throw new Error("question type is null");
            }
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsTypePost({type: questionType});
            return response.data;
        }, {
            onError: (error: Error) => {
                console.error("Question creation template error:", error);
            }
        }
    );

    const value = {
        createQuestion: async (questionDTO: QuestionDTO) => {
            try {
                return await createQuestionMutation.mutateAsync(questionDTO);
            } catch (err) {
                console.error("Question creation failed:", err);
                throw err;
            }
        },

        updateQuestion: async (questionId: string, questionDTO: QuestionDTO) => {
            try {
                return await updateQuestionMutation.mutateAsync({questionId, questionDTO});
            } catch (err) {
                console.error("Question updating failed:", err);
                throw err;
            }
        },


        deleteQuestion: async (questionId: string) => {
            try {
                await deleteQuestionMutation.mutateAsync(questionId);
            } catch (err) {
                console.error("Question deleted failed:", err);
                throw err;
            }
        },

        createQuestionTemplate: async (questionType: QuestionType) => {
            try {
                return await createQuestionTemplateMutation.mutateAsync(questionType);
            } catch (err) {
                console.error("Question deleted failed:", err);
                throw err;
            }
        },

        isCreatingQuestion: createQuestionMutation.isLoading,
        isUpdatingQuestion: updateQuestionMutation.isLoading,
        isDeletingQuestion: deleteQuestionMutation.isLoading,
        isCreatingQuestionTemplate: createQuestionTemplateMutation.isLoading,

        errorCreateQuestion: createQuestionMutation.error,
        errorUpdateQuestion: updateQuestionMutation.error,
        errorDeleteQuestion: deleteQuestionMutation.error,
        errorCreateQuestionTemplate: createQuestionTemplateMutation.error,
    };

    return (
        <QuestionCRUDContext.Provider value={value}>
            {children}
        </QuestionCRUDContext.Provider>
    );
};
