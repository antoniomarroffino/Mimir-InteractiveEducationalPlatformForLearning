import {useQuery} from 'react-query';
import {quizAttemptApi} from "../../../config/config.ts";

export const useGetQuizAttemptsByUser = (azureOID: string | undefined) => {
    return useQuery({
        queryKey: ['quizAttempts', azureOID],
        queryFn: async () => quizAttemptApi.apiAttemptsUserUserAzureOIDGet({userAzureOID: azureOID!})
            .then(response => response.data),
        staleTime: 1000 * 60 * 5,
    });
};