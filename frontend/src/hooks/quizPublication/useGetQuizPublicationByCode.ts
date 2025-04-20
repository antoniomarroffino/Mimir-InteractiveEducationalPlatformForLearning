import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { quizPublicationApi } from "../../../config/config.ts";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

interface UseGetQuizPublicationByCodeOptions {
    enabled?: boolean;
}

export const useGetQuizPublicationByCode = (
    code: string,
    options?: UseGetQuizPublicationByCodeOptions
) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const isResultsPage = location.pathname.includes('/results');

    const cachedData = queryClient.getQueryData<QuizPublicationDTO>(['quizPublication', code]);

    const defaultEnabled = !!code.trim() && !isResultsPage && !cachedData;
    const shouldEnable = options?.enabled ?? defaultEnabled;

    return useQuery<QuizPublicationDTO, Error>({
        enabled: shouldEnable,
        queryKey: ['quizPublication', code],
        queryFn: async () => {
            try {
                const response = await quizPublicationApi.apiPublicationsByCodeCodeGet({ code });
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
