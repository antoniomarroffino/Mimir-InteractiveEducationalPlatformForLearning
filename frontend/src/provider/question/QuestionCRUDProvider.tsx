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
        async (params: {
            questionDTO: QuestionDTO,
            courseId?: string,
            folderId?: string,
            quizId?: string
        }) => {
            // Usa gli ID passati o quelli selezionati
            const courseId = params.courseId || selectedCourseId;
            const folderId = params.folderId || selectedFolderId;
            const quizId = params.quizId || selectedQuizId;

            if (!courseId) {
                throw new Error("No course selected");
            }
            if (!folderId) {
                throw new Error("No folder selected");
            }
            if (!quizId) {
                throw new Error("No quiz selected");
            }

            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsPost({
                courseId,
                folderId,
                quizId,
                questionDTO: params.questionDTO,
            });
            return response.data;
        },
        {
            onSuccess: (newQuestion, params) => {
                const courseId = params.courseId || selectedCourseId;
                const folderId = params.folderId || selectedFolderId;
                const quizId = params.quizId || selectedQuizId;

                queryClient.setQueryData(
                    ["questions", courseId, folderId, quizId],
                    (oldData: QuestionDTO[] | undefined) => (oldData ? [...oldData, newQuestion] : [newQuestion])
                );
            },
            onError: (error: Error) => {
                console.error("Question creation error:", error);
            }
        }
    );

    const updateQuestionMutation = useMutation(
        async (params: {
            questionId: string,
            questionDTO: QuestionDTO,
            courseId?: string,
            folderId?: string,
            quizId?: string
        }) => {
            const courseId = params.courseId || selectedCourseId;
            const folderId = params.folderId || selectedFolderId;
            const quizId = params.quizId || selectedQuizId;

            if (!courseId || !folderId || !quizId || !params.questionId) {
                throw new Error("Missing required parameters");
            }

            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsQuestionIdPut({
                courseId,
                folderId,
                quizId,
                questionId: params.questionId,
                questionDTO: params.questionDTO,
            });
            return response.data;
        },
        {
            onSuccess: (updatedQuestion, params) => {
                const courseId = params.courseId || selectedCourseId;
                const folderId = params.folderId || selectedFolderId;
                const quizId = params.quizId || selectedQuizId;

                queryClient.setQueryData(
                    ["questions", courseId, folderId, quizId],
                    (oldData: QuestionDTO[] | undefined) => {
                        if (!oldData) return [updatedQuestion];
                        return oldData.map((question) =>
                            question.id === updatedQuestion.id ? updatedQuestion : question
                        );
                    }
                );
            },
            onError: (error: Error) => {
                console.error("Question updating error:", error);
            }
        }
    );

    const deleteQuestionMutation = useMutation(
        async (params: {
            questionId: string,
            courseId?: string,
            folderId?: string,
            quizId?: string
        }) => {
            const courseId = params.courseId || selectedCourseId;
            const folderId = params.folderId || selectedFolderId;
            const quizId = params.quizId || selectedQuizId;

            if (!courseId || !folderId || !quizId || !params.questionId) {
                throw new Error("Missing required parameters");
            }

            return questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsQuestionIdDelete({
                courseId,
                folderId,
                quizId,
                questionId: params.questionId,
            });
        },
        {
            onSuccess: (_, params) => {
                const courseId = params.courseId || selectedCourseId;
                const folderId = params.folderId || selectedFolderId;
                const quizId = params.quizId || selectedQuizId;

                queryClient.setQueryData<QuestionDTO[]>(
                    ["questions", courseId, folderId, quizId],
                    (old) => old?.filter(q => q.id !== params.questionId) || []
                );
                deselectQuestion();
            },
            onError: (error: Error) => {
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
        createQuestion: async (questionDTO: QuestionDTO & {
            courseId?: string,
            folderId?: string,
            quizId?: string
        }) => {
            try {
                return await createQuestionMutation.mutateAsync({
                    questionDTO,
                    courseId: questionDTO.courseId,
                    folderId: questionDTO.folderId,
                    quizId: questionDTO.quizId
                });
            } catch (err) {
                console.error("Question creation failed:", err);
                throw err;
            }
        },

        updateQuestion: async (questionId: string, questionDTO: QuestionDTO & {
            courseId?: string,
            folderId?: string,
            quizId?: string
        }) => {
            try {
                return await updateQuestionMutation.mutateAsync({
                    questionId,
                    questionDTO,
                    courseId: questionDTO.courseId,
                    folderId: questionDTO.folderId,
                    quizId: questionDTO.quizId
                });
            } catch (err) {
                console.error("Question updating failed:", err);
                throw err;
            }
        },

        deleteQuestion: async (questionId: string, params?: {
            courseId?: string,
            folderId?: string,
            quizId?: string
        }) => {
            try {
                await deleteQuestionMutation.mutateAsync({
                    questionId,
                    ...params
                });
            } catch (err) {
                console.error("Question deletion failed:", err);
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
