import {useQuery, UseQueryOptions} from "react-query";
import {quizPublicationApi} from "../../../config/config";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";

export const useGetQuizPublicationById = (
    quizPublicationId: string,
    options?: Omit<UseQueryOptions<QuizPublicationDTO, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<QuizPublicationDTO, Error>({
        queryKey: ['quizPublication', quizPublicationId],
        queryFn: async () => quizPublicationApi.apiPublicationsPublicationIDGet({
            publicationID: quizPublicationId,
        }).then(response => response.data),
        staleTime: 1000 * 60 * 5,
        ...options
    });
};