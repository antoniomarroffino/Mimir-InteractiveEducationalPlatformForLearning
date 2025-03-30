import React, {useMemo} from "react";
import {useMutation, useQueryClient} from "react-query";
import {QuizDTO} from "@dti-isin/backend-api-client";
import {quizApi} from "../../../config/config.ts";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {QuizCRUDContext} from "../../contexts/quiz/QuizCRUDContext.tsx";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";

export const QuizCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();

    const {selectedCourseId} = useCourseSelection();
    const {deselectQuiz} = useQuizSelection();

    const createQuizMutation = useMutation(
        async ({folderId, name, description}: { folderId: string; name: string; description?: string }) => {
            if (!selectedCourseId) {
                throw new Error("No course selected");
            }
            if (!folderId) {
                throw new Error("No folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId: selectedCourseId,
                folderId: folderId,
                quizDTO: {name, description}
            });
            return response.data;
        },
        {
            onSuccess: (newQuiz, {folderId}) => {
                queryClient.setQueryData<QuizDTO[]>(
                    ["quizzes", selectedCourseId, folderId],
                    (old) => old ? [...old, newQuiz] : [newQuiz]
                );
            },
            onError: (error: Error) => {
                console.error("Quiz creation error:", error);
            }
        }
    );

    const updateQuizMutation = useMutation<QuizDTO, Error, { folderId: string, quizId: string, quizDTO: QuizDTO }>(
        async ({folderId, quizId, quizDTO}) => {
            if (!selectedCourseId) {
                throw new Error("No course selected");
            }
            if (!folderId) {
                throw new Error("No folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut({
                courseId: selectedCourseId,
                folderId: folderId,
                quizId,
                quizDTO
            });
            return response.data;
        },
        {
            onSuccess: (updatedQuizDTO, {folderId}) => {
                queryClient.invalidateQueries({
                    queryKey: ["quizzes", selectedCourseId, folderId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["quiz", selectedCourseId, folderId, updatedQuizDTO.id],
                });
            },
            onError: (error: Error) => {
                console.error("Quiz update error:", error);
            }
        }
    );

    const deleteQuizMutation = useMutation<void, Error, { folderId: string, quizId: string }>(
        async ({folderId, quizId}) => {
            if (!selectedCourseId) {
                throw new Error("No course selected");
            }
            if (!folderId) {
                throw new Error("No folder selected");
            }
            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId: selectedCourseId,
                folderId: folderId,
                quizId
            });
        },
        {
            onSuccess: (_, {folderId}) => {
                queryClient.invalidateQueries({
                    queryKey: ["quizzes", selectedCourseId, folderId],
                });
                deselectQuiz();
            },
            onError: (error: Error) => {
                console.error("Quiz delete error:", error);
            }
        }
    );

    const value = useMemo(() => ({
        createQuiz: async (folderId: string, name: string, description?: string) => {
            try {
                return await createQuizMutation.mutateAsync({folderId, name, description});
            } catch (err) {
                console.error("Quiz creation failed:", err);
                throw err;
            }
        },

        updateQuiz: async (folderId: string, quizId: string, quizDTO: QuizDTO) => {
            try {
                return await updateQuizMutation.mutateAsync({folderId, quizId, quizDTO});
            } catch (err) {
                console.error("Quiz update failed:", err);
                throw err;
            }
        },

        deleteQuiz: async (folderId: string, quizId: string) => {
            try {
                await deleteQuizMutation.mutateAsync({folderId, quizId});
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