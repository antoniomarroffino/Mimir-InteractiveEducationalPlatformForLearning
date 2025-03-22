import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { quizPublicationApi } from "../../../config/config.ts";
import { QuizPublicationCRUDContext } from "./QuizPublicationCRUDContext.ts";

type CreateQuizPublicationDTO = Omit<QuizPublicationDTO, 'id' | 'publicationCode'>;

export const QuizPublicationCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: createPublicationMutation,
        isLoading: isCreatingPublication,
        error: errorCreatePublication,
    } = useMutation<QuizPublicationDTO, Error, CreateQuizPublicationDTO>({
        mutationFn: async (dto) => {
            const response = await quizPublicationApi.apiPublicationsPost({
                quizPublicationDTO: {
                    ...dto,
                    published: true
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["publications"]);
        },
    });

    const {
        mutateAsync: updatePublicationMutation,
        isLoading: isUpdatingPublication,
        error: errorUpdatePublication,
    } = useMutation<QuizPublicationDTO, Error, QuizPublicationDTO>({
        mutationFn: async (dto) => {
            const response = await quizPublicationApi.apiPublicationsIdPut({
                id: dto.id!,
                quizPublicationDTO: dto
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["publications"]);
        },
    });

    const {
        mutateAsync: deletePublicationMutation,
        isLoading: isDeletingPublication,
        error: errorDeletePublication,
    } = useMutation<void, Error, string>({
        mutationFn: async (id) => {
            await quizPublicationApi.apiPublicationsIdDelete({ id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["publications"]);
        },
    });

    const value = {
        createPublication: createPublicationMutation,
        updatePublication: updatePublicationMutation,
        deletePublication: deletePublicationMutation,

        isCreatingPublication,
        isUpdatingPublication,
        isDeletingPublication,

        errorCreatePublication,
        errorUpdatePublication,
        errorDeletePublication,
    };

    return (
        <QuizPublicationCRUDContext.Provider value={value}>
            {children}
        </QuizPublicationCRUDContext.Provider>
    );
};