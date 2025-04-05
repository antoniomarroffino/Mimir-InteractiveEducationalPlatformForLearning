import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { quizPublicationApi } from "../../../config/config.ts";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

export const useGetQuizPublicationByCode = (code: string) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const isResultsPage = location.pathname.includes('/results');

    // Controlla se i dati sono già in cache
    const cachedData = queryClient.getQueryData<QuizPublicationDTO>(['quizPublication', code]);

    return useQuery<QuizPublicationDTO, Error>({
        enabled: !!code.trim() && !isResultsPage && !cachedData,
        queryKey: ['quizPublication', code],
        queryFn: async () => {
            try {
                const response = await quizPublicationApi.apiPublicationsByCodeCodeGet({
                    code,
                });
                return response.data;
            } catch (error) {
                console.error('Errore nella chiamata API:', error);
                throw error;
            }
        },
        initialData: cachedData,
        retry: 1,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: (data) => {
            queryClient.setQueryData(['quizPublication', code], data);
        },
        onError: (error) => {
            console.error('Errore nel recupero della pubblicazione:', error);
        }
    });
};