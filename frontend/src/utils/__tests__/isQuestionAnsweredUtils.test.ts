import { describe, it, expect } from 'vitest';
import {
    QuestionType,
    QuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO,
    MultipleChoiceQuestionDTO,
    TrueFalseQuestionDTO,
    QuestionResponseDTO,
} from '@dti-isin/backend-api-client';
import { getUnansweredQuestions } from '../isQuestionAnswered';

describe('getUnansweredQuestions utility', () => {
    it('should return empty array when all questions are answered', () => {
        const questions: (TrueFalseQuestionDTO | MultipleChoiceQuestionDTO)[] = [
            { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true },
            { id: '2', type: QuestionType.MultipleChoice, points: 1, choices: [], correctAnswerIndexes: [] },
        ];

        const responses: QuestionResponseDTO[] = [
            { questionId: '1', responseType: QuestionType.TrueFalse, selectedAnswer: true } as TrueFalseQuestionResponseDTO,
            { questionId: '2', responseType: QuestionType.MultipleChoice, selectedAnswerIndexes: [0] } as MultipleChoiceQuestionResponseDTO,
        ];

        const result = getUnansweredQuestions(questions, responses);

        expect(result).toEqual([]);
    });

    it('should return all question indexes when no responses are given', () => {
        const questions: (TrueFalseQuestionDTO | MultipleChoiceQuestionDTO)[] = [
            { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true },
            { id: '2', type: QuestionType.MultipleChoice, points: 1, choices: [], correctAnswerIndexes: [] },
        ];

        const responses: QuestionResponseDTO[] = [];

        const result = getUnansweredQuestions(questions, responses);

        expect(result).toEqual([1, 2]);
    });

    it('should detect unanswered TrueFalse question', () => {
        const questions: TrueFalseQuestionDTO[] = [
            { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true },
        ];

        const responses: QuestionResponseDTO[] = [
            { questionId: '1', responseType: QuestionType.TrueFalse } as TrueFalseQuestionResponseDTO,
        ];

        const result = getUnansweredQuestions(questions, responses);

        expect(result).toEqual([1]);
    });

    it('should detect unanswered MultipleChoice question', () => {
        const questions: MultipleChoiceQuestionDTO[] = [
            { id: '1', type: QuestionType.MultipleChoice, points: 1, choices: [], correctAnswerIndexes: [] },
        ];

        const responses: QuestionResponseDTO[] = [
            { questionId: '1', responseType: QuestionType.MultipleChoice, selectedAnswerIndexes: [] } as MultipleChoiceQuestionResponseDTO,
        ];

        const result = getUnansweredQuestions(questions, responses);

        expect(result).toEqual([1]);
    });

    it('should handle undefined selectedAnswerIndexes gracefully', () => {
        const questions: MultipleChoiceQuestionDTO[] = [
            { id: '1', type: QuestionType.MultipleChoice, points: 1, choices: [], correctAnswerIndexes: [] },
        ];

        const responses: QuestionResponseDTO[] = [
            { questionId: '1', responseType: QuestionType.MultipleChoice } as MultipleChoiceQuestionResponseDTO,
        ];

        const result = getUnansweredQuestions(questions, responses);

        expect(result).toEqual([1]);
    });

    it('should consider unknown question types as unanswered', () => {
        const questions: QuestionDTO[] = [
            { id: '1', type: 'Unsupported' as QuestionType, points: 1 },
        ];

        const responses: QuestionResponseDTO[] = [
            { questionId: '1', responseType: 'Unsupported' as QuestionType },
        ];

        const result = getUnansweredQuestions(questions, responses);

        expect(result).toEqual([1]);
    });
});
