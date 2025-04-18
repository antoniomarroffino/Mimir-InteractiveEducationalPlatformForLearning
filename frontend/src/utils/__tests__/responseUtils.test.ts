import {describe, expect, it} from 'vitest';
import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import {checkIfAnswered, isResponseCorrect} from "../responseUtils.ts";

describe('Question Response Utilities', () => {
    const mockTrueFalseQuestion = {
        id: "true-false-question-id",
        type: QuestionType.TrueFalse,
        correctAnswer: true
    } as TrueFalseQuestionDTO;

    const mockMultipleChoiceQuestion = {
        id: "multiple-choice-question-id",
        type: QuestionType.MultipleChoice,
        correctAnswerIndexes: [0, 2]
    } as MultipleChoiceQuestionDTO;

    describe('isResponseCorrect', () => {
        it('should return true for correct true/false answer', () => {
            const response: TrueFalseQuestionResponseDTO = {
                selectedAnswer: true,
                responseType: QuestionType.TrueFalse,
                questionId: mockTrueFalseQuestion.id!,
            };
            expect(isResponseCorrect(mockTrueFalseQuestion, response)).toBe(true);
        });

        it('should return false for incorrect true/false answer', () => {
            const response: TrueFalseQuestionResponseDTO = {
                selectedAnswer: false,
                responseType: QuestionType.TrueFalse,
                questionId: mockTrueFalseQuestion.id!,
            };
            expect(isResponseCorrect(mockTrueFalseQuestion, response)).toBe(false);
        });

        describe('Multiple Choice scenarios', () => {
            it('should return true for exact match of correct indexes', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: [0, 2],
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(isResponseCorrect(mockMultipleChoiceQuestion, response)).toBe(true);
            });

            it('should return true for correct indexes in different order', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: [2, 0],
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(isResponseCorrect(mockMultipleChoiceQuestion, response)).toBe(true);
            });

            it('should return false for partial match', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: [0],
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(isResponseCorrect(mockMultipleChoiceQuestion, response)).toBe(false);
            });

            it('should return false for extra indexes', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: [0, 1, 2],
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(isResponseCorrect(mockMultipleChoiceQuestion, response)).toBe(false);
            });

            it('should return for response indexes undefined', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: undefined,
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(isResponseCorrect(mockMultipleChoiceQuestion, response)).toBe(false);
            })
        });

        it('should return false for unknown question type', () => {
            const unknownQuestion = {
                type: 'UNKNOWN' as QuestionType,
            } as QuestionDTO;
            const response = {} as QuestionResponseDTO;
            expect(isResponseCorrect(unknownQuestion, response)).toBe(false);
        });
    });

    describe('checkIfAnswered', () => {
        it('should return false when no response exists', () => {
            expect(checkIfAnswered(mockTrueFalseQuestion)).toBe(false);
        });

        describe('TrueFalse questions', () => {
            it('should return true when answer is provided', () => {
                const response: TrueFalseQuestionResponseDTO = {
                    selectedAnswer: true,
                    responseType: QuestionType.TrueFalse,
                    questionId: mockTrueFalseQuestion.id!,
                };
                expect(checkIfAnswered(mockTrueFalseQuestion, response)).toBe(true);
            });

            it('should return false when answer is undefined', () => {
                const response: TrueFalseQuestionResponseDTO = {
                    selectedAnswer: undefined,
                    responseType: QuestionType.TrueFalse,
                    questionId: mockTrueFalseQuestion.id!,
                };
                expect(checkIfAnswered(mockTrueFalseQuestion, response)).toBe(false);
            });
        });

        describe('MultipleChoice questions', () => {
            it('should return true when at least one index is selected', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: [0],
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(checkIfAnswered(mockMultipleChoiceQuestion, response)).toBe(true);
            });

            it('should return false when no indexes are selected', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: [],
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(checkIfAnswered(mockMultipleChoiceQuestion, response)).toBe(false);
            });

            it('should return false when indexes are undefined', () => {
                const response: MultipleChoiceQuestionResponseDTO = {
                    selectedAnswerIndexes: undefined,
                    responseType: QuestionType.MultipleChoice,
                    questionId: mockMultipleChoiceQuestion.id!,
                };
                expect(checkIfAnswered(mockMultipleChoiceQuestion, response)).toBe(false);
            });
        });

        it('should return false for unknown question type', () => {
            const unknownQuestion = {
                type: 'UNKNOWN' as QuestionType,
            } as QuestionDTO;
            const response = {} as QuestionResponseDTO;
            expect(checkIfAnswered(unknownQuestion, response)).toBe(false);
        });
    });
});