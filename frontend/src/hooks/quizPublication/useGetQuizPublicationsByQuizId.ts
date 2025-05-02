import {useQuery} from "react-query";
import {quizPublicationApi} from "../../../config/config.ts";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";

export const useGetQuizPublicationsByQuizId = (quizId: string) => {
    return useQuery<QuizPublicationDTO[], Error>({
        queryKey: ['quizPublications', quizId],
        queryFn: async () => quizPublicationApi.apiPublicationsByQuizIdQuizIdGet({
            quizId,
        }).then(response => response.data),
        staleTime: 1000 * 60 * 5
    })
}