import {useQuery} from 'react-query';
import {quizAttemptApi} from "../../../config/config.ts";

export const useGetQuizAttemptsByUser = (azureOID: string | undefined) => {
    return useQuery(
        ['userQuizAttempts', azureOID],
        () => quizAttemptApi.apiAttemptsUserUserAzureOIDGet({userAzureOID: azureOID!})
            .then(response => response.data),
        {
            enabled: !!azureOID,
            refetchInterval: 30000,
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: true,
            retry: 2,
            staleTime: 1000 * 60 * 5,
            onError: (error) => {
                console.error('Error fetching user quiz attempts:', error);
            }
        }
    );
};