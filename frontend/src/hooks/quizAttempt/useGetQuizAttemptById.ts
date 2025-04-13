import { QuizAttemptDTO } from "@dti-isin/backend-api-client";
import {useQuery} from "react-query";
import {quizAttemptApi} from "../../../config/config.ts";

export const useGetQuizAttemptById = (attemptId: string) => {
    return useQuery<QuizAttemptDTO, Error>({
        queryKey: ['quizAttempt', attemptId],
        queryFn: async () => quizAttemptApi.apiAttemptsAttemptIdGet({attemptId})
            .then(result => result.data),
        staleTime: 1000 * 60 * 5
    })
}