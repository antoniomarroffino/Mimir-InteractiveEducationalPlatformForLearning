import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {useQuery} from "react-query";
import {quizAttemptApi} from "../../../config/config.ts";

export const useRecoverQuizAttempt = (userAzureOID: string, quizPublicationId: string) => {
    return useQuery<QuizAttemptDTO | null, Error>({
        queryKey: ['quizAttemptRecovered', userAzureOID, quizPublicationId],
        queryFn: () => quizAttemptApi.apiAttemptsRecoverGet({
            userAzureOID,
            quizPublicationId
        })
            .then((response) => response.data)
            .catch((error) => {
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }),
        enabled: !!userAzureOID && !!quizPublicationId,
        retry: false
    })
}