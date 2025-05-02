import { useQuery } from "react-query";
import { quizPublicationApi } from "../../../config/config.ts";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

export const useGetQuizPublicationByCode = (code: string) => {
    return useQuery<QuizPublicationDTO, Error>({
        queryKey: ['quizPublication', code],
        queryFn: async () =>
            await quizPublicationApi.apiPublicationsByCodeCodeGet({
                code,
            }).then((response) => response.data),
        staleTime: 1000 * 60 * 5,
    });
};