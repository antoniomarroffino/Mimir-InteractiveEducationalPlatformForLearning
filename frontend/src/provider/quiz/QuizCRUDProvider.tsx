import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { quizApi } from "../../../config/config";
import { QuizDTO } from "@dti-isin/backend-api-client";
import { QuizCRUDContext } from "../../contexts/quiz/QuizCRUDContext";

export const QuizCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const createQuizMutation = useMutation(
        async ({ courseId, folderId, quizDTO }: { courseId: string; folderId: string; quizDTO: QuizDTO }) => {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId,
                folderId,
                quizDTO,
            });
            return response.data;
        },
        {
            onSuccess: (newQuiz, params) => {
                queryClient.setQueryData<QuizDTO[]>(["quizzes", params.courseId, params.folderId], (old) =>
                    old ? [...old, newQuiz] : [newQuiz]
                );
            },
            onError: (error: Error) => {
                console.error("Quiz creation error:", error);
            },
        }
    );

    const updateQuizMutation = useMutation(
        async ({
                   courseId,
                   folderId,
                   quizId,
                   quizDTO,
               }: {
            courseId: string;
            folderId: string;
            quizId: string;
            quizDTO: QuizDTO;
        }) => {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut({
                courseId,
                folderId,
                quizId,
                quizDTO,
            });
            return response.data;
        },
        {
            onSuccess: (updatedQuizDTO, params) => {
                queryClient.setQueryData<QuizDTO>(["quiz", params.courseId, params.folderId, params.quizId], () => updatedQuizDTO);
                queryClient.setQueryData<QuizDTO[]>(["quizzes", params.courseId, params.folderId], (oldList) =>
                    oldList?.map((q) => (q.id === updatedQuizDTO.id ? updatedQuizDTO : q)) ?? []
                );
            },
            onError: (error: Error) => {
                console.error("Quiz update error:", error);
            },
        }
    );

    const deleteQuizMutation = useMutation(
        async ({ courseId, folderId, quizId }: { courseId: string; folderId: string; quizId: string }) => {
            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId,
                folderId,
                quizId,
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
            },
        }
    );

    const value = useMemo(() => ({
        createQuiz: (courseId: string, folderId: string, quizDTO: QuizDTO) =>
            createQuizMutation.mutateAsync({ courseId, folderId, quizDTO }),
        updateQuiz: (courseId: string, folderId: string, quizId: string, quizDTO: QuizDTO) =>
            updateQuizMutation.mutateAsync({ courseId, folderId, quizId, quizDTO }),
        deleteQuiz: (courseId: string, folderId: string, quizId: string) =>
            deleteQuizMutation.mutateAsync({ courseId, folderId, quizId }),

        isCreatingQuiz: createQuizMutation.isLoading,
        isUpdatingQuiz: updateQuizMutation.isLoading,
        isDeletingQuiz: deleteQuizMutation.isLoading,

        errorCreateQuiz: createQuizMutation.error ?? null,
        errorUpdateQuiz: updateQuizMutation.error ?? null,
        errorDeleteQuiz: deleteQuizMutation.error ?? null,
    }), [
        createQuizMutation,
        updateQuizMutation,
        deleteQuizMutation,
    ]);

    return <QuizCRUDContext.Provider value={value}>{children}</QuizCRUDContext.Provider>;
};
