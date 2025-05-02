import React from "react";
import {useMutation, useQueryClient} from "react-query";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {quizPublicationApi} from "../../../config/config.ts";
import {QuizPublicationCRUDContext} from "../../contexts/quizPublication/QuizPublicationCRUDContext.ts";

type CreateQuizPublicationDTO = Omit<QuizPublicationDTO, 'id' | 'publicationCode'>;

export const QuizPublicationCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
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
        onSuccess: (createdQuizPublicationDTO) => {
            queryClient.invalidateQueries(["quizPublications", createdQuizPublicationDTO.quizId]);
        },
    });

    const {
        mutateAsync: deactivatePublicationMutation,
        isLoading: isDeactivatingPublication,
        error: errorDeactivatePublication,
    } = useMutation<QuizPublicationDTO, Error, string>({
        mutationFn: async (publicationId: string) => {
            const response = await quizPublicationApi.apiPublicationsDeactivatePublicationIdPut({publicationId: publicationId});
            return response.data;
        },
        onSuccess: (updatedQuizPublicationDTO, publicationId) => {
            queryClient.invalidateQueries(["quizPublications", updatedQuizPublicationDTO.quizId]);
            queryClient.invalidateQueries(["quizPublication", publicationId]);
        },
    });

    const {
        mutateAsync: deletePublicationMutation,
        isLoading: isDeletingPublication,
        error: errorDeletePublication,
    } = useMutation<void, Error, string>({
        mutationFn: async (id) => {
            await quizPublicationApi.apiPublicationsIdDelete({id});
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["quizPublications"]);
        },
    });

    const value = {
        createPublication: createPublicationMutation,
        deletePublication: deletePublicationMutation,
        deactivatePublication: deactivatePublicationMutation,

        isCreatingPublication,
        isDeletingPublication,
        isDeactivatingPublication,

        errorCreatePublication,
        errorDeletePublication,
        errorDeactivatePublication,
    };

    return (
        <QuizPublicationCRUDContext.Provider value={value}>
            {children}
        </QuizPublicationCRUDContext.Provider>
    );
};