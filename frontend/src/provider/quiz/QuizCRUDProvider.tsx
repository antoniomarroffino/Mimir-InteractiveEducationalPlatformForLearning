import React, {useMemo} from "react";
import {useMutation, useQueryClient} from "react-query";
import {QuizDTO} from "@dti-isin/backend-api-client";
import {quizApi} from "../../../config/config.ts";
import {QuizCRUDContext} from "../../contexts/quiz/QuizCRUDContext.tsx";

export const QuizCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();

    const createQuizMutation = useMutation(
        async ({courseId, folderId, quizDTO}: { courseId: string, folderId: string; quizDTO: QuizDTO }) => {
            if (!courseId) {
                throw new Error("No course selected");
            }
            if (!folderId) {
                throw new Error("No folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId,
                folderId,
                quizDTO
            });
            return response.data;
        },
        {
            onSuccess: (newQuiz, params) => {
                queryClient.setQueryData<QuizDTO[]>(
                    ["quizzes", params.courseId, params.folderId],
                    (old) => old ? [...old, newQuiz] : [newQuiz]
                );
            },
            onError: (error: Error) => {
                console.error("Quiz creation error:", error);
            }
        }
    );

    const updateQuizMutation = useMutation<QuizDTO, Error, {
        courseId: string,
        folderId: string,
        quizId: string,
        quizDTO: QuizDTO
    }>(
        async ({courseId, folderId, quizId, quizDTO}) => {
            if (!courseId) {
                throw new Error("No course selected");
            }
            if (!folderId) {
                throw new Error("No folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut({
                courseId,
                folderId,
                quizId,
                quizDTO
            });
            return response.data;
        },
        {
            onSuccess: (updatedQuizDTO, params) => {
                queryClient.invalidateQueries({
                    queryKey: ["quizzes", params.courseId, params.folderId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["quiz", params.courseId, params.folderId, updatedQuizDTO.id],
                });
            },
            onError: (error: Error) => {
                console.error("Quiz update error:", error);
            }
        }
    );

    const deleteQuizMutation = useMutation<void, Error, { courseId: string, folderId: string, quizId: string }>(
        async ({courseId, folderId, quizId}) => {
            if (!courseId) {
                throw new Error("No course selected");
            }
            if (!folderId) {
                throw new Error("No folder selected");
            }
            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId,
                folderId,
                quizId
            });
        },
        {
            onSuccess: (_, params) => {
                queryClient.invalidateQueries({
                    queryKey: ["quizzes", params.courseId, params.folderId],
                });
            },
            onError: (error: Error) => {
                console.error("Quiz delete error:", error);
            }
        }
    );

    const value = useMemo(() => ({
        createQuiz: async (courseId: string, folderId: string, quizDTO: QuizDTO) => {
            try {
                return await createQuizMutation.mutateAsync({courseId, folderId, quizDTO});
            } catch (err) {
                console.error("Quiz creation failed:", err);
                throw err;
            }
        },

        updateQuiz: async (courseId: string, folderId: string, quizId: string, quizDTO: QuizDTO) => {
            try {
                return await updateQuizMutation.mutateAsync({courseId, folderId, quizId, quizDTO});
            } catch (err) {
                console.error("Quiz update failed:", err);
                throw err;
            }
        },

        deleteQuiz: async (courseId: string, folderId: string, quizId: string) => {
            try {
                await deleteQuizMutation.mutateAsync({courseId, folderId, quizId});
            } catch (err) {
                console.error("Quiz deletion failed:", err);
                throw err;
            }
        },

        isCreatingQuiz: createQuizMutation.isLoading,
        isUpdatingQuiz: updateQuizMutation.isLoading,
        isDeletingQuiz: deleteQuizMutation.isLoading,

        errorCreateQuiz: createQuizMutation.error,
        errorUpdateQuiz: updateQuizMutation.error,
        errorDeleteQuiz: deleteQuizMutation.error,
    }), [createQuizMutation, updateQuizMutation, deleteQuizMutation]);

    return (
        <QuizCRUDContext.Provider value={value}>
            {children}
        </QuizCRUDContext.Provider>
    );
};