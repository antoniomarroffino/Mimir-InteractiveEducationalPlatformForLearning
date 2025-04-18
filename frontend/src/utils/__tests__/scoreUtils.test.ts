import { describe, expect, it } from 'vitest';
import {
    calculateEarnedPoints,
    calculateTotalAvailablePoints,
    calculateScorePercentage,
    getQuestionEarnedPoints,
    getQuestionTotalPoints
} from '../scoreUtils.ts';
import {
    QuizAttemptDTO,
    QuizPublicationDTO,
    QuestionType,
    QuestionResponseDTO,
    QuestionDTO
} from '@dti-isin/backend-api-client';

describe('Quiz Calculation Utilities', () => {
    const mockAttempt: QuizAttemptDTO = {
        quizPublicationId: '123',
        responses: [
            { responseType: QuestionType.TrueFalse, questionId: '1', earnedPoints: 5 },
            { responseType: QuestionType.MultipleChoice, questionId: '2', earnedPoints: 3 },
            { responseType: QuestionType.MultipleChoice, questionId: '3', earnedPoints: 2 }
        ]
    };

    const mockPublication: QuizPublicationDTO = {
        id: '123',
        courseId: '1',
        folderId: '1',
        quizId: '1',
        questions: [
            { type: QuestionType.TrueFalse, id: '1', points: 10 },
            { type: QuestionType.MultipleChoice, id: '2', points: 5 },
            { type: QuestionType.MultipleChoice, id: '3', points: 5 }
        ]
    };

    describe('calculateEarnedPoints', () => {
        it('should correctly sum all earned points from responses', () => {
            expect(calculateEarnedPoints(mockAttempt)).toBe(10);
        });

        it('should return 0 when no responses exist', () => {
            expect(calculateEarnedPoints({
                quizPublicationId: '123',
                responses: []
            })).toBe(0);
        });

        it('should handle undefined responses array', () => {
            expect(calculateEarnedPoints({
                quizPublicationId: '123',
                responses: undefined,
            } as QuizAttemptDTO)).toBe(0);
        });

        it('should ignore responses with undefined earnedPoints', () => {
            const attempt: QuizAttemptDTO = {
                quizPublicationId: '123',
                responses: [
                    { responseType: QuestionType.TrueFalse, questionId: '1', earnedPoints: 2 },
                    { responseType: QuestionType.TrueFalse, questionId: '2', earnedPoints: undefined },
                    { responseType: QuestionType.MultipleChoice, questionId: '3', earnedPoints: 3 }
                ]
            };
            expect(calculateEarnedPoints(attempt)).toBe(5);
        });
    });

    describe('calculateTotalAvailablePoints', () => {
        it('should correctly sum all question points', () => {
            expect(calculateTotalAvailablePoints(mockPublication)).toBe(20);
        });

        it('should return 0 for empty questions array', () => {
            expect(calculateTotalAvailablePoints({
                id: '123',
                courseId: '1',
                folderId: '1',
                quizId: '1',
                questions: []
            })).toBe(0);
        });

        it('should handle undefined questions array', () => {
            expect(calculateTotalAvailablePoints({
                id: '123',
                courseId: '1',
                folderId: '1',
                quizId: '1',
                questions: undefined
            })).toBe(0);
        });
    });

    describe('calculateScorePercentage', () => {
        it('should calculate correct percentage for positive values', () => {
            expect(calculateScorePercentage(75, 100)).toBe(75);
        });

        it('should return 0 when total points is 0', () => {
            expect(calculateScorePercentage(100, 0)).toBe(0);
        });

        it('should handle floating point results correctly', () => {
            expect(calculateScorePercentage(7, 9)).toBeCloseTo(77.78);
        });

        it('should return 0 when earned points is 0', () => {
            expect(calculateScorePercentage(0, 100)).toBe(0);
        });

        it('should handle maximum percentage correctly', () => {
            expect(calculateScorePercentage(100, 100)).toBe(100);
        });

        it('should handle decimal input values', () => {
            expect(calculateScorePercentage(33.33, 66.66)).toBeCloseTo(50);
        });
    });

    describe('getQuestionEarnedPoints', () => {
        it('should return earned points when present', () => {
            const response: QuestionResponseDTO = {
                responseType: QuestionType.TrueFalse,
                questionId: '1',
                earnedPoints: 5
            };
            expect(getQuestionEarnedPoints(response)).toBe(5);
        });

        it('should return 0 for undefined response', () => {
            expect(getQuestionEarnedPoints()).toBe(0);
        });

        it('should return 0 when earnedPoints is missing', () => {
            const response: QuestionResponseDTO = {
                responseType: QuestionType.TrueFalse,
                questionId: '1',
                earnedPoints: undefined
            };
            expect(getQuestionEarnedPoints(response)).toBe(0);
        });
    });

    describe('getQuestionTotalPoints', () => {
        it('should return specified points value', () => {
            const question: QuestionDTO = {
                type: QuestionType.TrueFalse,
                id: '1',
                points: 10
            };
            expect(getQuestionTotalPoints(question)).toBe(10);
        });

        it('should handle 0 points correctly returning 1', () => {
            const question: QuestionDTO = {
                type: QuestionType.TrueFalse,
                id: '1',
                points: 0
            };
            expect(getQuestionTotalPoints(question)).toBe(1);
        });
    });
});