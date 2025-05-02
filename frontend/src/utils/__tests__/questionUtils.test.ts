import { describe, it, expect, vi } from 'vitest';
import {
    isTrueFalseQuestion,
    isMultipleChoiceQuestion,
    getCurrentQuestionResponse,
    createUpdatedResponse,
} from '../questionUtils';
import {
    QuestionType,
    TrueFalseQuestionDTO,
    MultipleChoiceQuestionDTO,
    QuestionResponseDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO
} from '@dti-isin/backend-api-client';

// Mock reale della QuestionResponseFactory
vi.mock('../components/question/QuestionResponseFactory', () => ({
    QuestionResponseFactory: {
        createTrueFalseResponse: vi.fn((questionId: string, answer?: boolean) => ({
            responseType: QuestionType.TrueFalse,
            questionId,
            selectedAnswer: answer,
        })),
        createMultipleChoiceResponse: vi.fn((questionId: string, answer: number[] = []) => ({
            responseType: QuestionType.MultipleChoice,
            questionId,
            selectedAnswerIndexes: answer,
        })),
        createResponse: vi.fn((type: QuestionType, questionId: string, answer?: boolean | number[]) => {
            if (type === QuestionType.TrueFalse) {
                return {
                    responseType: QuestionType.TrueFalse,
                    questionId,
                    selectedAnswer: answer as boolean,
                };
            } else if (type === QuestionType.MultipleChoice) {
                return {
                    responseType: QuestionType.MultipleChoice,
                    questionId,
                    selectedAnswerIndexes: answer as number[],
                };
            }
            throw new Error(`Unsupported question type: ${type}`);
        }),
    },
}));

describe('isTrueFalseQuestion', () => {
    it('should return true for TrueFalse questions', () => {
        const question: TrueFalseQuestionDTO = { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true };
        expect(isTrueFalseQuestion(question)).toBe(true);
    });

    it('should return false for non-TrueFalse questions', () => {
        const question: MultipleChoiceQuestionDTO = {
            id: '2',
            type: QuestionType.MultipleChoice,
            points: 1,
            choices: [],
            correctAnswerIndexes: [],
        };
        expect(isTrueFalseQuestion(question)).toBe(false);
    });
});

describe('isMultipleChoiceQuestion', () => {
    it('should return true for MultipleChoice questions', () => {
        const question: MultipleChoiceQuestionDTO = {
            id: '2',
            type: QuestionType.MultipleChoice,
            points: 1,
            choices: [],
            correctAnswerIndexes: [],
        };
        expect(isMultipleChoiceQuestion(question)).toBe(true);
    });

    it('should return false for non-MultipleChoice questions', () => {
        const question: TrueFalseQuestionDTO = { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true };
        expect(isMultipleChoiceQuestion(question)).toBe(false);
    });
});

describe('getCurrentQuestionResponse', () => {
    it('should return null if question is undefined', () => {
        expect(getCurrentQuestionResponse(undefined, [], 0)).toBeNull();
    });

    it('should return null if response at index does not exist', () => {
        const question: TrueFalseQuestionDTO = { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true };
        expect(getCurrentQuestionResponse(question, [], 0)).toBeNull();
    });

    it('should extract boolean response for TrueFalse question', () => {
        const question: TrueFalseQuestionDTO = { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true };

        const responses: TrueFalseQuestionResponseDTO[] = [ // 👈 uso il tipo corretto
            { questionId: '1', responseType: QuestionType.TrueFalse, selectedAnswer: true },
        ];

        expect(getCurrentQuestionResponse(question, responses, 0)).toBe(true);
    });

    it('should extract array response for MultipleChoice question', () => {
        const question: MultipleChoiceQuestionDTO = {
            id: '2',
            type: QuestionType.MultipleChoice,
            points: 1,
            choices: [],
            correctAnswerIndexes: [],
        };

        const responses: MultipleChoiceQuestionResponseDTO[] = [ // 👈 uso il tipo corretto
            { questionId: '2', responseType: QuestionType.MultipleChoice, selectedAnswerIndexes: [1, 2] },
        ];

        expect(getCurrentQuestionResponse(question, responses, 0)).toEqual([1, 2]);
    });

    it('should return empty array for MultipleChoice question with no selected indexes', () => {
        const question: MultipleChoiceQuestionDTO = {
            id: '3',
            type: QuestionType.MultipleChoice,
            points: 1,
            choices: [],
            correctAnswerIndexes: [],
        };
        const responses: QuestionResponseDTO[] = [
            { questionId: '3', responseType: QuestionType.MultipleChoice },
        ];
        expect(getCurrentQuestionResponse(question, responses, 0)).toEqual([]);
    });
});

describe('createUpdatedResponse', () => {
    it('should create updated TrueFalse response correctly', () => {
        const question: TrueFalseQuestionDTO = { id: '1', type: QuestionType.TrueFalse, points: 1, correctAnswer: true };
        const response = createUpdatedResponse(question, true, 10);

        expect(response).toEqual({
            responseType: QuestionType.TrueFalse,
            questionId: '1',
            selectedAnswer: true,
            timeSpent: 10,
        });
    });

    it('should create updated MultipleChoice response correctly', () => {
        const question: MultipleChoiceQuestionDTO = {
            id: '2',
            type: QuestionType.MultipleChoice,
            points: 1,
            choices: [],
            correctAnswerIndexes: [],
        };
        const response = createUpdatedResponse(question, [1, 2], 20);

        expect(response).toEqual({
            responseType: QuestionType.MultipleChoice,
            questionId: '2',
            selectedAnswerIndexes: [1, 2],
            timeSpent: 20,
        });
    });

    it('should throw error for unsupported question type', () => {
        const question: QuestionDTO = { id: '999', type: 'Unsupported' as QuestionType, points: 1 };

        expect(() => createUpdatedResponse(question, null, 5)).toThrow("Question type not supported.");
    });

    it('should return null for unsupported response type', () => {
        const question: QuestionDTO = { id: '4', type: 'Unsupported' as QuestionType, points: 1 };

        const responses: QuestionResponseDTO[] = [
            { questionId: '4', responseType: 'Unsupported' as QuestionType }
        ];

        const result = getCurrentQuestionResponse(question, responses, 0);

        expect(result).toBeNull();
    });

    it('should return null for TrueFalse question when selectedAnswer is undefined', () => {
        const question: TrueFalseQuestionDTO = { id: '5', type: QuestionType.TrueFalse, points: 1, correctAnswer: true };
        const responses: QuestionResponseDTO[] = [
            { questionId: '5', responseType: QuestionType.TrueFalse } as TrueFalseQuestionResponseDTO
        ];

        const result = getCurrentQuestionResponse(question, responses, 0);

        expect(result).toBeNull();
    });

    it('should create updated TrueFalse response with undefined selectedAnswer when answer is null', () => {
        const question: TrueFalseQuestionDTO = { id: '6', type: QuestionType.TrueFalse, points: 1, correctAnswer: true };
        const response = createUpdatedResponse(question, null, 15);

        expect(response).toEqual({
            responseType: QuestionType.TrueFalse,
            questionId: '6',
            selectedAnswer: undefined,
            timeSpent: 15,
        });
    });

    it('should create updated MultipleChoice response with empty selectedAnswerIndexes when answer is null', () => {
        const question: MultipleChoiceQuestionDTO = {
            id: '7',
            type: QuestionType.MultipleChoice,
            points: 1,
            choices: [],
            correctAnswerIndexes: [],
        };

        const response = createUpdatedResponse(question, null, 25);

        expect(response).toEqual({
            responseType: QuestionType.MultipleChoice,
            questionId: '7',
            selectedAnswerIndexes: [],
            timeSpent: 25,
        });
    });

});
