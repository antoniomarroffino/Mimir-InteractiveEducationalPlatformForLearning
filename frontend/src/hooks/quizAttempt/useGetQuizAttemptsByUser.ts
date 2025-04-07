import {useQuery} from 'react-query';
import {quizAttemptApi} from "../../../config/config.ts";

export const useGetQuizAttemptsByUser = (azureOID: string | undefined) => {
    return useQuery(
        ['quizAttempts', azureOID],
        () => quizAttemptApi.apiAttemptsUserUserAzureOIDGet({userAzureOID: azureOID!})
            .then(response => response.data),
        {
            enabled: !!azureOID,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            staleTime: 0,
            cacheTime: 1000 * 60 * 5,
            retry: 2,
            onError: (error) => {
                console.error('Error fetching user quiz attempts:', error);
            }
        }
    );
};