import React, {useMemo} from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuizDTO } from "@dti-isin/backend-api-client";
import {quizApi} from "../../../config/config.ts";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {QuizCRUDContext} from "../../contexts/quiz/QuizCRUDContext.tsx";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";

export const QuizCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const {selectedCourseId} = useCourseSelection();
    const {selectedFolderId} = useFolderSelection();
    const {deselectQuiz} = useQuizSelection();

    const createQuizMutation = useMutation(
        async ({name, description}: { name: string; description?: string }) => {
            console.log("courseId " + selectedCourseId);
            console.log("folderId " + selectedFolderId);
            if (!selectedCourseId || !selectedFolderId) {
                throw new Error("No course or folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizDTO: {name, description}
            });
            return response.data;
        },
        {
            onSuccess: (newQuiz) => {
                queryClient.setQueryData<QuizDTO[]>(
                    ["quizzes", selectedCourseId, selectedFolderId],
                    (old) => old ? [...old, newQuiz] : [newQuiz]
                );
            },
            onError: (error: Error) => {
                console.error("Quiz creation error:", error);
            }
        }
    );

    const updateQuizMutation = useMutation<QuizDTO, Error, {quizId: string, quizDTO: QuizDTO}>(
        async ({quizId, quizDTO}) => {
            if (!selectedCourseId || !selectedFolderId) {
                throw new Error("No course or folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId,
                quizDTO
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["quizzes", selectedCourseId, selectedFolderId],
                });
            }, onError: (error: Error) => {
                console.error("Quiz update error:", error);
            }
        }
    );

    const deleteQuizMutation = useMutation<void, Error, string>(
        async (quizId: string) => {
            if (!selectedCourseId || !selectedFolderId) {
                throw new Error("No course or folder selected");
            }
            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId: selectedCourseId,
                folderId: selectedFolderId,
                quizId
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["quizzes", selectedCourseId, selectedFolderId],
                });
                deselectQuiz();
            }, onError: (error: Error) => {
                console.error("Quiz delete error:", error);
            }
        }
    );

    
    const value = useMemo(() => ({
        createQuiz: async (name: string, description?: string) => {
            try {
                return await createQuizMutation.mutateAsync({name, description});
            } catch (err) {
                console.error("Quiz creation failed:", err);
                throw err;
            }
        },

        updateQuiz: async (quizId: string, quizDTO: QuizDTO) => {
            try {
                return await updateQuizMutation.mutateAsync({ quizId, quizDTO });
            } catch (err) {
                console.error("Quiz update failed:", err);
                throw err;
            }
        },

        deleteQuiz: async (quizId: string) => {
            try {
                await deleteQuizMutation.mutateAsync(quizId);
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
