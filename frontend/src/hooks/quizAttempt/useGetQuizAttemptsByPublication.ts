import {useQuery} from 'react-query';
import {quizAttemptApi} from "../../../config/config.ts";
import {QuizAttemptDTO} from '@dti-isin/backend-api-client';


export const useGetQuizAttemptsByPublication = (publicationId: string) => {
    return useQuery<QuizAttemptDTO[], Error>({
        queryKey: ['quizAttempts', publicationId],
        queryFn: () => quizAttemptApi.apiAttemptsByPublicationPublicationIdGet({publicationId})
            .then(response => response.data),

        enabled: !!publicationId,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.error('Error fetching quiz attempts:', error);
        }
    })
}