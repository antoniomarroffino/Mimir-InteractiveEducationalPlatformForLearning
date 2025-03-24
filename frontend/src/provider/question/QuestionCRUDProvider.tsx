import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuestionDTO, QuestionType } from "@dti-isin/backend-api-client";
import { QuestionCRUDContext } from "../../contexts/question/QuestionCRUDContext.ts";
import { questionApi } from "../../../config/config.ts";

export const QuestionCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: createQuestionMutation,
        isLoading: isCreatingQuestion,
        error: errorCreateQuestion,
    } = useMutation<
        QuestionDTO,
        Error,
        { courseId: string; folderId: string; quizId: string; questionDTO: QuestionDTO }
    >({
        mutationFn: async ({ courseId, folderId, quizId, questionDTO }) => {
            if (!courseId || !folderId || !quizId) {
                throw new Error("No course, folder, or quiz selected");
            }
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsPost({
                courseId,
                folderId,
                quizId,
                questionDTO,
            });
            return response.data;
        },
        onSuccess: (newQuestion, { courseId, folderId, quizId }) => {
            queryClient.setQueryData(
                ["questions", courseId, folderId, quizId],
                (oldData: QuestionDTO[] | undefined) => (oldData ? [...oldData, newQuestion] : [newQuestion])
            );
            queryClient.invalidateQueries({
                queryKey: ["questions", courseId, folderId, quizId],
            });
        },
    });

    const {
        mutateAsync: updateQuestionMutation,
        isLoading: isUpdatingQuestion,
        error: errorUpdateQuestion,
    } = useMutation<
        QuestionDTO,
        Error,
        { courseId: string; folderId: string; quizId: string; questionId: string; questionDTO: QuestionDTO }
    >({
        mutationFn: async ({ courseId, folderId, quizId, questionId, questionDTO }) => {
            if (!courseId || !folderId || !quizId || !questionId) {
                throw new Error("Missing required parameters");
            }
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsQuestionIdPut({
                courseId,
                folderId,
                quizId,
                questionId,
                questionDTO,
            });
            return response.data;
        },
        onSuccess: (updatedQuestion, variables) => {
            queryClient.setQueryData(
                ["questions", variables.courseId, variables.folderId, variables.quizId],
                (oldData: QuestionDTO[] | undefined) => {
                    if (!oldData) return [updatedQuestion];
                    return oldData.map((question) =>
                        question.id === updatedQuestion.id ? updatedQuestion : question
                    );
                }
            );
            queryClient.invalidateQueries({
                queryKey: ["questions", variables.courseId, variables.folderId, variables.quizId],
            });
        },
    });

    const {
        mutateAsync: deleteQuestionMutation,
        isLoading: isDeletingQuestion,
        error: errorDeleteQuestion,
    } = useMutation<
        void,
        Error,
        { courseId: string; folderId: string; quizId: string; questionId: string }
    >({
        mutationFn: async ({ courseId, folderId, quizId, questionId }) => {
            if (!courseId || !folderId || !quizId || !questionId) {
                throw new Error("Missing required parameters");
            }
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsQuestionIdDelete({
                courseId,
                folderId,
                quizId,
                questionId,
            });
            return response.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(
                ["questions", variables.courseId, variables.folderId, variables.quizId],
                (oldData: QuestionDTO[] | undefined) => {
                    if (!oldData) return [];
                    return oldData.filter((question) => question.id !== variables.questionId);
                }
            );
            queryClient.invalidateQueries({
                queryKey: ["questions", variables.courseId, variables.folderId, variables.quizId],
            });
        },
    });

    const {
        mutateAsync: createQuestionTemplateMutation,
        isLoading: isCreatingQuestionTemplate,
        error: errorCreateQuestionTemplate,
    } = useMutation<
        QuestionDTO,
        Error,
        QuestionType
    >({
        mutationFn: async (questionType: QuestionType) => {
            if (!questionType) {
                throw new Error("question type is null");
            }
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsTypePost({type: questionType});
            return response.data;
        }
    });


    const createQuestion = (
        courseId: string,
        folderId: string,
        quizId: string,
        questionDTO: QuestionDTO
    ): Promise<QuestionDTO> =>
        createQuestionMutation({ courseId, folderId, quizId, questionDTO });

    const updateQuestion = (
        courseId: string,
        folderId: string,
        quizId: string,
        questionId: string,
        data: QuestionDTO
    ): Promise<QuestionDTO> =>
        updateQuestionMutation({ courseId, folderId, quizId, questionId, questionDTO: data });

    const deleteQuestion = (
        courseId: string,
        folderId: string,
        quizId: string,
        questionId: string
    ): Promise<void> => deleteQuestionMutation({ courseId, folderId, quizId, questionId });

    const value = {
        createQuestion,
        updateQuestion,
        deleteQuestion,
        createQuestionTemplate: createQuestionTemplateMutation,

        isCreatingQuestion,
        isUpdatingQuestion,
        isDeletingQuestion,
        isCreatingQuestionTemplate,

        errorCreateQuestion,
        errorUpdateQuestion,
        errorDeleteQuestion,
        errorCreateQuestionTemplate,
    };

    return (
        <QuestionCRUDContext.Provider value={value}>
            {children}
        </QuestionCRUDContext.Provider>
    );
};
