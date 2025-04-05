import {useQuery} from 'react-query';
import {quizAttemptApi} from "../../../config/config";

export const useGetQuizAttemptsByPublication = (publicationId: string) => {
    return useQuery(
        ['quizAttempts', publicationId],
        () => quizAttemptApi.apiAttemptsByPublicationPublicationIdGet({publicationId})
            .then(response => response.data),
        {
            enabled: !!publicationId,
            refetchInterval: 5000,
            refetchIntervalInBackground: false,
            onError: (error) => {
                console.error('Error fetching quiz attempts:', error);
            }
        }
    );
};