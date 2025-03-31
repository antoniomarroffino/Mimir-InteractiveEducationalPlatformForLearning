import {useQuery} from "react-query";
import {quizPublicationApi} from "../../../config/config.ts";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

export const useGetQuizPublicationById = (quizPublicationId: string) => {
    return useQuery<QuizPublicationDTO, Error>({
        queryKey: ['quizPublication', quizPublicationId],
        queryFn: async () => quizPublicationApi.apiPublicationsPublicationIDGet({
            publicationID: quizPublicationId,
        }).then(response => response.data),
        staleTime: 1000 * 60 * 5
    })
}