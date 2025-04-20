import {QuestionBankDTO} from "@dti-isin/backend-api-client";
import {QuestionBankCRUDContext} from "../../contexts/questionBank/QuestionBankCRUDContext.ts";
import {useMutation, useQueryClient} from "react-query";
import {questionBankApi} from "../../../config/config.ts";
import React, {useMemo} from "react";

export const QuestionBankCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();

    const createQuestionBankMutation = useMutation(
        (questionBankDTO: QuestionBankDTO) =>
            questionBankApi.apiQuestionBanksPost({questionBankDTO}).then(response => response.data),
        {
            onSuccess: (newQuestionBank) => {
                queryClient.setQueryData<QuestionBankDTO[]>(["questionBanks"], (oldQuestionBanks) =>
                    oldQuestionBanks ? [...oldQuestionBanks, newQuestionBank] : [newQuestionBank]
                );
                queryClient.invalidateQueries(["questionBanks"]);
            },
            onError: (error: Error) => {
                console.error("Question bank creation error:", error);
            }
        }
    );

    const updateQuestionBankMutation = useMutation(
        ({id, questionBankDTO}: { id: string, questionBankDTO: QuestionBankDTO }) =>
            questionBankApi.apiQuestionBanksIdPut({id, questionBankDTO}).then(response => response.data),
        {
            onSuccess: (updatedQuestionBank) => {
                queryClient.setQueryData<QuestionBankDTO[]>(["questionBanks"], (oldQuestionBanks) =>
                    oldQuestionBanks ? oldQuestionBanks.map(questionBankDTO =>
                        questionBankDTO.id === updatedQuestionBank.id ? updatedQuestionBank : questionBankDTO
                    ) : [updatedQuestionBank]
                );
                queryClient.invalidateQueries(["questionBanks"]);
            },
            onError: (error: Error) => {
                console.error("Question bank update error:", error);
            }
        }
    );

    const reorderQuestionsMutation = useMutation(
        ({id, orderedQuestionIds}: { id: string, orderedQuestionIds: string[] }) =>
            questionBankApi.apiQuestionBanksIdReorderPatch({id, requestBody: orderedQuestionIds}),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["questionBanks"]);
            },
            onError: (error: Error) => {
                console.error("Question reorder failed:", error);
            }
        }
    );

    const deleteQuestionBankMutation = useMutation(
        (id: string) => questionBankApi.apiQuestionBanksIdDelete({id}),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["questionBanks"]);
            },
            onError: (error: Error) => {
                console.error("Question bank delete error:", error);
            }
        }
    );

    const value = useMemo(() => ({
        createQuestionBank: async (questionBankDTO: QuestionBankDTO) => {
            try {
                return await createQuestionBankMutation.mutateAsync(questionBankDTO);
            } catch (err) {
                console.error("Question bank creation failed:", err);
                throw err;
            }
        },

        updateQuestionBank: async (id: string, questionBankDTO: QuestionBankDTO) => {
            try {
                return await updateQuestionBankMutation.mutateAsync({id, questionBankDTO});
            } catch (err) {
                console.error("Question bank updating failed:", err);
                throw err;
            }
        },

        reorderQuestionBank: async (id: string, orderedQuestionIds: string[]): Promise<void> => {
            try {
                await reorderQuestionsMutation.mutateAsync({id, orderedQuestionIds});
            } catch (err) {
                console.error("Question reorder failed:", err);
                throw err;
            }
        },

        deleteQuestionBank: async (id: string) => {
            try {
                await deleteQuestionBankMutation.mutateAsync(id);
            } catch (err) {
                console.error("Question bank delete failed:", err);
                throw err;
            }
        },

        isCreatingQuestionBank: createQuestionBankMutation.isLoading,
        isUpdatingQuestionBank: updateQuestionBankMutation.isLoading,
        isDeletingQuestionBank: deleteQuestionBankMutation.isLoading,
        isReorderingQuestions: reorderQuestionsMutation.isLoading,

        errorCreateQuestionBank: createQuestionBankMutation.error,
        errorUpdateQuestionBank: updateQuestionBankMutation.error,
        errorDeleteQuestionBank: deleteQuestionBankMutation.error,
        errorReorderQuestions: reorderQuestionsMutation.error,
    }), [createQuestionBankMutation, updateQuestionBankMutation, deleteQuestionBankMutation, reorderQuestionsMutation]);

    return (
        <QuestionBankCRUDContext.Provider value={value}>
            {children}
        </QuestionBankCRUDContext.Provider>
    );
}