import React, {useMemo} from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuizDTO } from "@dti-isin/backend-api-client";
import {quizApi} from "../../../config/config.ts";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {useFolder} from "../../hooks/useFolder.ts";
import {QuizCRUDContext} from "../../contexts/quiz/QuizCRUDContext.ts";

export const QuizCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const {selectedCourseId: contextCourseId} = useCourseSelection();
    const {selectedFolderId: contextFolderId} = useFolder();

    //TODO: da sistemare, mi serve useFolderSelection
    const courseId = useMemo(() =>  contextCourseId, [contextCourseId]);
    const folderId = useMemo(() => contextFolderId, [contextFolderId]);


    const {
        mutateAsync: createQuizMutation,
        isLoading: isCreatingQuiz,
        error: errorCreateQuiz,
    } = useMutation<QuizDTO, Error, string>({
        mutationFn: async (name: string) => {
            if (!courseId || !folderId) {
                throw new Error("No course or folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId,
                folderId,
                quizDTO: {name}
            });
            return response.data;
        },
        onSuccess: (newQuiz) => {
            queryClient.setQueryData(
                ["quizzes", courseId, folderId],
                (oldData: QuizDTO[] | undefined) => {
                    return oldData ? [...oldData, newQuiz] : [newQuiz];
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["quizzes", courseId, folderId],
            });
        },
    });

    const {
        mutateAsync: updateQuizMutation,
        isLoading: isUpdatingQuiz,
        error: errorUpdateQuiz,
    } = useMutation<QuizDTO, Error, {quizId: string, quizDTO: QuizDTO}>({
        mutationFn: async ({quizId, quizDTO}) => {
            if (!courseId || !folderId) {
                throw new Error("No course or folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut({
                courseId,
                folderId,
                quizId,
                quizDTO
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes", courseId, folderId],
            });
        },
    });

    const {
        mutateAsync: deleteQuizMutation,
        isLoading: isDeletingQuiz,
        error: errorDeleteQuiz,
    } = useMutation<void, Error, string>({
        mutationFn: async (quizId: string) => {
            if (!courseId || !folderId) {
                throw new Error("No course or folder selected");
            }
            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId,
                folderId,
                quizId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes", courseId, folderId],
            });
        },
    });

    const getQuiz = (quizId: string): Promise<QuizDTO> => {
        if (!courseId || !folderId) {
            return Promise.reject(new Error("No course or folder selected"));
        }
        return queryClient.fetchQuery<QuizDTO>(
            ["quiz", courseId, folderId, quizId],
            async () => {
                const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet({
                    courseId,
                    folderId,
                    quizId,
                });
                return response.data;
            }
        );
    };

    const updateQuiz = (
        quizId: string,
        quizDTO: QuizDTO
    ): Promise<QuizDTO> =>
        updateQuizMutation({ quizId, quizDTO });


    const value = {
        createQuiz: createQuizMutation,
        getQuiz,
        updateQuiz,
        deleteQuiz: deleteQuizMutation,

        isCreatingQuiz,
        isUpdatingQuiz,
        isDeletingQuiz,

        errorCreateQuiz,
        errorUpdateQuiz,
        errorDeleteQuiz,
    };

    return (
        <QuizCRUDContext.Provider value={value}>
            {children}
        </QuizCRUDContext.Provider>
    );
};
