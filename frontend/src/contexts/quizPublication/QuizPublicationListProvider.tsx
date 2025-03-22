import React from "react";
import { useQuery } from "react-query";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { quizPublicationApi } from "../../../config/config.ts";
import { QuizPublicationListContext } from "./QuizPublicationListContext.ts";

export const QuizPublicationListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        data: publications = [],
        isLoading: isLoadingPublications,
        error: errorPublications,
        refetch: fetchPublications,
    } = useQuery<QuizPublicationDTO[], Error>({
        queryKey: ["publications"],
        queryFn: async () => (await quizPublicationApi.apiPublicationsGet()).data,
    });

    const value = {
        publications,
        isLoadingPublications,
        errorPublications,
        fetchPublications,
    };

    return (
        <QuizPublicationListContext.Provider value={value}>
            {children}
        </QuizPublicationListContext.Provider>
    );
};