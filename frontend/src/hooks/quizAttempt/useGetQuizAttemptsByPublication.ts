import {useQuery} from 'react-query';
import {quizAttemptApi} from "../../../config/config.ts";


export const useGetQuizAttemptsByPublication = (publicationId: string) => {
    return useQuery(
        ['quizAttempts', publicationId],
        () => quizAttemptApi.apiAttemptsByPublicationPublicationIdGet({publicationId})
            .then(response => response.data),
        {
            enabled: !!publicationId,
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: true,
            onError: (error) => {
                console.error('Error fetching quiz attempts:', error);
            }
        }
    );
};