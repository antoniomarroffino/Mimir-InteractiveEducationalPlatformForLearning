import { describe, it, expect, vi } from 'vitest';
import { QuestionDTO, QuestionType, QuizAttemptDTO, QuestionResponseDTO } from '@dti-isin/backend-api-client';
import {calculateQuestionStats} from "../statisticsUtils.ts";

vi.mock('../responseUtils', () => ({
    isResponseCorrect: (_question: QuestionDTO, response: QuestionResponseDTO) => {
        return response.questionId?.endsWith('1');
    }
}));

describe('calculateQuestionStats utility', () => {
    const mockQuestions: QuestionDTO[] = [
        { id: 'q1', type: QuestionType.TrueFalse, points: 1 },
        { id: 'q2', type: QuestionType.MultipleChoice, points: 2 }
    ];

    const mockAttempts: QuizAttemptDTO[] = [
        {
            quizPublicationId: 'pub1',
            responses: [
                { questionId: 'q1', responseType: QuestionType.TrueFalse, timeSpent: 30 },
                { questionId: 'q2', responseType: QuestionType.MultipleChoice, timeSpent: 40 }
            ]
        },
        {
            quizPublicationId: 'pub1',
            responses: [
                { questionId: 'q1', responseType: QuestionType.TrueFalse, timeSpent: 20 }
            ]
        }
    ];

    it('should correctly calculate stats for each question', () => {
        const stats = calculateQuestionStats(mockQuestions, mockAttempts);

        expect(stats.length).toBe(2);

        const q1Stats = stats.find(stat => stat.question.id === 'q1');
        expect(q1Stats).toBeDefined();
        expect(q1Stats?.totalResponses).toBe(2);
        expect(q1Stats?.correctResponses).toBe(2);
        expect(q1Stats?.percentageCorrect).toBe(100);
        expect(q1Stats?.averageTimeSpent).toBeCloseTo(25);

        const q2Stats = stats.find(stat => stat.question.id === 'q2');
        expect(q2Stats).toBeDefined();
        expect(q2Stats?.totalResponses).toBe(1);
        expect(q2Stats?.correctResponses).toBe(0);
        expect(q2Stats?.percentageCorrect).toBe(0);
        expect(q2Stats?.averageTimeSpent).toBe(40);
    });

    it('should return 0 stats if no attempts', () => {
        const stats = calculateQuestionStats(mockQuestions, []);

        expect(stats.length).toBe(2);
        stats.forEach(stat => {
            expect(stat.totalResponses).toBe(0);
            expect(stat.correctResponses).toBe(0);
            expect(stat.percentageCorrect).toBe(0);
            expect(stat.averageTimeSpent).toBe(0);
        });
    });

    it('should handle questions with no responses', () => {
        const stats = calculateQuestionStats([{ id: 'q3', type: QuestionType.TrueFalse, points: 1 }], mockAttempts);

        const q3Stats = stats[0];
        expect(q3Stats.totalResponses).toBe(0);
        expect(q3Stats.correctResponses).toBe(0);
        expect(q3Stats.percentageCorrect).toBe(0);
        expect(q3Stats.averageTimeSpent).toBe(0);
    });

    it('should not crash if attempts contain undefined responses', () => {
        const attempts: QuizAttemptDTO[] = [
            { quizPublicationId: 'pub1', responses: undefined }
        ];

        const stats = calculateQuestionStats(mockQuestions, attempts);

        expect(stats.length).toBe(2);
        stats.forEach(stat => {
            expect(stat.totalResponses).toBe(0);
            expect(stat.correctResponses).toBe(0);
            expect(stat.percentageCorrect).toBe(0);
            expect(stat.averageTimeSpent).toBe(0);
        });
    });

    it('should handle responses with undefined timeSpent', () => {
        const questions: QuestionDTO[] = [
            { id: 'q1', type: QuestionType.TrueFalse, points: 1 }
        ];

        const attempts: QuizAttemptDTO[] = [
            {
                quizPublicationId: 'pub1',
                responses: [
                    { questionId: 'q1', responseType: QuestionType.TrueFalse }
                ]
            }
        ];

        const stats = calculateQuestionStats(questions, attempts);

        expect(stats.length).toBe(1);

        const q1Stats = stats[0];
        expect(q1Stats.totalResponses).toBe(1);
        expect(q1Stats.correctResponses).toBe(1);
        expect(q1Stats.percentageCorrect).toBe(100);
        expect(q1Stats.averageTimeSpent).toBe(0);
    });

});
