import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { QuizPublicationContext } from "../contexts/QuizPublicationContext";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { quizPublicationApi } from "../../config/config";

// Tipo per la creazione senza campi generati dal backend
type CreateQuizPublicationDTO = Omit<QuizPublicationDTO, 'id' | 'publicationCode'>;

export const QuizPublicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    // Query per tutte le pubblicazioni
    const {
        data: publications = [],
        isLoading: isLoadingPublications,
        error: errorPublications,
    } = useQuery<QuizPublicationDTO[], Error>({
        queryKey: ["publications"],
        queryFn: async () => (await quizPublicationApi.apiPublicationsGet()).data,
    });

    // Mutation per creare una pubblicazione
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

    const getPublicationByReferences = async (courseId: string, folderId: string, quizId: string) => {
        try {
            const response = await quizPublicationApi.apiPublicationsByReferencesCourseIdFolderIdQuizIdGet(
                {
                    courseId: courseId,
                    folderId: folderId,
                    quizId: quizId
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching publication:", error);
            return null;
        }
    };

    const value = {
        publications,
        isLoadingPublications,
        errorPublications,
        createPublication: createPublicationMutation,
        fetchPublications: async () => {
            await queryClient.invalidateQueries(["publications"]);
        },
        getPublicationByReferences,
        isCreatingPublication,
        errorCreatePublication,
    };

    return (
        <QuizPublicationContext.Provider value={value}>
            {children}
        </QuizPublicationContext.Provider>
    );
};