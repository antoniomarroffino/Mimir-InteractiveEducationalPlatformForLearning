import {QuestionDTO, QuestionResponseDTO, QuizAttemptDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';

export const calculateEarnedPoints = (attempt: QuizAttemptDTO): number => {
    return attempt.responses?.reduce((totalPoints, response) => {
        return totalPoints + (response.earnedPoints || 0);
    }, 0) || 0;
};

export const calculateTotalAvailablePoints = (publication: QuizPublicationDTO): number => {
    return publication.questions?.reduce((total, question) => {
        return total + (question.points || 1);
    }, 0) || 0;
};

export const calculateScorePercentage = (earnedPoints: number, totalPoints: number): number => {
    if (totalPoints === 0) return 0;
    return (earnedPoints / totalPoints) * 100;
};

export const getQuestionEarnedPoints = (
    response?: QuestionResponseDTO
): number => {
    return response?.earnedPoints || 0;
};

export const getQuestionTotalPoints = (question: QuestionDTO): number => {
    return question.points || 1;
};

export const getScoreEmoji = (earned: number, total: number): string => {
    if (total === 0) return '❓';
    const percentage = (earned / total) * 100;
    if (percentage === 100) return '🏆';
    if (percentage >= 90) return '🌟';
    if (percentage >= 70) return '👍';
    if (percentage >= 50) return '🤔';
    return '😕';
};