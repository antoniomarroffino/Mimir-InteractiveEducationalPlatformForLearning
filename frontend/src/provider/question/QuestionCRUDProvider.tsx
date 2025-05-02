import React from "react";
import {useMutation, useQueryClient} from "react-query";
import {QuestionBankDTO, QuestionDTO, QuestionType} from "@dti-isin/backend-api-client";
import {QuestionCRUDContext} from "../../contexts/question/QuestionCRUDContext.ts";
import {questionApi} from "../../../config/config.ts";

export const QuestionCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();


    const createQuestionMutation = useMutation(
        async (questionDTO: QuestionDTO) => {
            if (!questionDTO.questionBankId) {
                throw new Error("No question bank selected");
            }

            const response = await questionApi.apiQuestionsPost({questionDTO});
            return response.data;
        },
        {
            onSuccess: (newQuestion) => {
                queryClient.setQueryData(
                    ["questionBanks", newQuestion.questionBankId],
                    (oldData: QuestionBankDTO | undefined) => {
                        if (!oldData) {
                            return oldData;
                        }
                        return {
                            ...oldData,
                            questions: [...(oldData.questions || []), newQuestion]
                        };
                    }
                );
                queryClient.invalidateQueries(['questionBanks', newQuestion.questionBankId]);
                queryClient.invalidateQueries(['questionBanks']);
            },
            onError: (error: Error) => {
                console.error("Question creation error:", error);
            }
        }
    );

    const updateQuestionMutation = useMutation(
        async (params: {
            questionId: string,
            questionDTO: QuestionDTO
        }) => {
            if (!params.questionId) {
                throw new Error("Missing required parameters");
            }

            const response = await questionApi.apiQuestionsQuestionIdPut({
                questionId: params.questionId,
                questionDTO: params.questionDTO,
            });
            return response.data;
        },
        {
            onSuccess: (updatedQuestion) => {
                queryClient.setQueryData(
                    ["questionBanks", updatedQuestion.questionBankId],
                    (oldData: QuestionBankDTO | undefined) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            questions: oldData.questions!.map((question) =>
                                question.id === updatedQuestion.id ? updatedQuestion : question
                            ),
                        };
                    }
                );
                queryClient.invalidateQueries(['questionBanks', updatedQuestion.questionBankId]);
                queryClient.invalidateQueries(['questionBanks']);
            },
            onError: (error: Error) => {
                console.error("Question updating error:", error);
            }
        }
    );

    const deleteQuestionMutation = useMutation(
        async (params: { questionId: string, questionBankId: string }) => {
            if (!params.questionId) {
                throw new Error("Missing required parameters");
            }

            const response = await questionApi.apiQuestionsQuestionIdDelete({
                questionId: params.questionId,
            });
            return response.data;
        },
        {
            onSuccess: (_, params) => {
                queryClient.setQueryData(
                    ["questionBanks", params.questionBankId],
                    (oldData: QuestionBankDTO | undefined) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            questions: oldData.questions!.filter(
                                (q) => q.id !== params.questionId
                            ),
                        };
                    }
                );
                queryClient.invalidateQueries(['questionBanks', params.questionBankId]);
                queryClient.invalidateQueries(['questionBanks']);
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
            const response = await questionApi.apiQuestionsTypePost({type: questionType});
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
                return await updateQuestionMutation.mutateAsync({
                    questionId,
                    questionDTO
                });
            } catch (err) {
                console.error("Question updating failed:", err);
                throw err;
            }
        },

        deleteQuestion: async (questionId: string, questionBankId: string) => {
            try {
                await deleteQuestionMutation.mutateAsync({
                    questionId,
                    questionBankId
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
