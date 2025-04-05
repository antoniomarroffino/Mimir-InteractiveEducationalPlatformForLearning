import {useQuery} from 'react-query';
import {QuizAttemptDTO} from '@dti-isin/backend-api-client';
import {quizAttemptApi} from "../../../config/config";

export const useGetQuizAttemptsByPublication = (publicationId: string) => {
    return useQuery<QuizAttemptDTO[], Error>(
        ['quizAttempts', publicationId],
        () => quizAttemptApi.apiAttemptsByPublicationPublicationIdGet({publicationId})
            .then((response) => response.data),
        {
            enabled: !!publicationId,
            onError: (error) => {
                console.error('Error fetching quiz attempts:', error);
            }
        }
    );
};