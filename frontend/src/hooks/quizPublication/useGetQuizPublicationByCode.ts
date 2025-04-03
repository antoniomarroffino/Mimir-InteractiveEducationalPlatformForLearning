import {useQuery} from "react-query";
import {quizPublicationApi} from "../../../config/config.ts";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

export const useGetQuizPublicationByCode = (code: string) => {
    return useQuery<QuizPublicationDTO, Error>({
        enabled: !!code.trim(),
        queryKey: ['quizPublication', code],
        queryFn: async () => {
            try {
                const response = await quizPublicationApi.apiPublicationsByCodeCodeGet({
                    code,
                });

                // Log dettagliato
                console.log('Risposta API:', response);

                return response.data;
            } catch (error) {
                console.error('Errore nella chiamata API:', error);
                throw error;
            }
        },
        retry: 1, // Limita i tentativi di retry
        staleTime: 1000 * 60 * 5,
        onError: (error) => {
            console.error('Errore nel recupero della pubblicazione:', error);
        }
    })
};