import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { QuizPublicationContext } from "../contexts/QuizPublicationContext";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { quizPublicationApi } from "../../config/config";

export const QuizPublicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const {
        data: publications = [],
        isLoading: isLoadingPublications,
        error: errorPublications,
        refetch: fetchPublications,
    } = useQuery<QuizPublicationDTO[], Error>({
        queryKey: ["publications"],
        //queryFn: async () => (await quizPublicationApi.apiPublicationsGet()).data,
    });

    const {
        mutateAsync: createPublicationMutation,
        isLoading: isCreatingPublication,
        error: errorCreatePublication,
    } = useMutation<QuizPublicationDTO, Error, Omit<QuizPublicationDTO, 'id' | 'publicationCode'>>({
        mutationFn: async (dto) => {
            const response = await quizPublicationApi.apiPublicationsPost({
                quizPublicationDTO: dto
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["publications"]);
        },
    });

    const createPublication = async (dto: Omit<QuizPublicationDTO, 'id' | 'publicationCode'>) => {
        try {
            await createPublicationMutation(dto);
        } catch (err) {
            console.error("Publication creation failed:", err);
            throw err;
        }
    };

    const value = {
        publications,
        isLoadingPublications,
        errorPublications,
        createPublication,
        fetchPublications,
        isCreatingPublication,
        errorCreatePublication,
    };

    return (
        <QuizPublicationContext.Provider value={value}>
            {children}
        </QuizPublicationContext.Provider>
    );
};