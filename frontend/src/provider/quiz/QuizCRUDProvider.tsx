import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuizDTO } from "@dti-isin/backend-api-client";
import { quizApi } from "../../../config/config.ts";
import { QuizCRUDContext } from "../../contexts/quiz/QuizCRUDContext.tsx";

export const QuizCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const createQuizMutation = useMutation(
        async ({ courseId, folderId, quizDTO }: { courseId: string, folderId: string; quizDTO: QuizDTO }) => {
            if (!courseId) throw new Error("No course selected");
            if (!folderId) throw new Error("No folder selected");

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

    const updateQuizMutation = useMutation(
        async ({ courseId, folderId, quizId, quizDTO }: {
            courseId: string,
            folderId: string,
            quizId: string,
            quizDTO: QuizDTO
        }) => {
            if (!courseId) throw new Error("No course selected");
            if (!folderId) throw new Error("No folder selected");

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
                // ✅ Evita il refetch e aggiorna direttamente la cache locale
                queryClient.setQueryData<QuizDTO>(
                    ["quiz", params.courseId, params.folderId, params.quizId],
                    (oldQuiz) => {
                        // Se il contenuto non è cambiato, mantieni il riferimento originale
                        if (JSON.stringify(oldQuiz) === JSON.stringify(updatedQuizDTO)) {
                            return oldQuiz;
                        }
                        return updatedQuizDTO;
                    }
                );

                // ✅ Se necessario aggiorni anche la lista dei quiz (es. per nome nella lista)
                queryClient.setQueryData<QuizDTO[]>(
                    ["quizzes", params.courseId, params.folderId],
                    (oldList) =>
                        oldList?.map(q => q.id === updatedQuizDTO.id ? updatedQuizDTO : q) ?? []
                );
            },
            onError: (error: Error) => {
                console.error("Quiz update error:", error);
            }
        }
    );


    const deleteQuizMutation = useMutation(
        async ({ courseId, folderId, quizId }: { courseId: string, folderId: string, quizId: string }) => {
            if (!courseId) throw new Error("No course selected");
            if (!folderId) throw new Error("No folder selected");

            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId,
                folderId,
                quizId
            });
        },
        {
            onSuccess: (_, params) => {
                queryClient.invalidateQueries({
                    queryKey: ["quizzes", params.courseId, params.folderId]
                });
            },
            onError: (error: Error) => {
                console.error("Quiz delete error:", error);
            }
        }
    );

    const value = useMemo(() => ({
        createQuiz: createQuizMutation,
        updateQuiz: updateQuizMutation,
        deleteQuiz: deleteQuizMutation
    }), [createQuizMutation, updateQuizMutation, deleteQuizMutation]);

    return (
        <QuizCRUDContext.Provider value={value}>
            {children}
        </QuizCRUDContext.Provider>
    );
};
