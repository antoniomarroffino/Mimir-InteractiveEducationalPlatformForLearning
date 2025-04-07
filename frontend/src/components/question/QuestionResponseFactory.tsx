import {
    MultipleChoiceQuestionResponseDTO,
    QuestionType,
    TrueFalseQuestionResponseDTO,
} from '@dti-isin/backend-api-client';


export type TrueFalseAnswer = boolean;
export type MultipleChoiceAnswer = number[];


type QuestionResponse<T extends QuestionType> =
    T extends QuestionType.TrueFalse ? TrueFalseQuestionResponseDTO :
        T extends QuestionType.MultipleChoice ? MultipleChoiceQuestionResponseDTO :
            never;

type QuestionResponseValue<T extends QuestionType> =
    T extends QuestionType.TrueFalse ? TrueFalseAnswer | undefined :
        T extends QuestionType.MultipleChoice ? MultipleChoiceAnswer :
            never;

export class QuestionResponseFactory {
    static createTrueFalseResponse(questionId: string, answer?: boolean): TrueFalseQuestionResponseDTO {
        return {
            responseType: QuestionType.TrueFalse,
            questionId,
            selectedAnswer: answer
        };
    }

    static createMultipleChoiceResponse(questionId: string, answer: number[] = []): MultipleChoiceQuestionResponseDTO {
        return {
            responseType: QuestionType.MultipleChoice,
            questionId,
            selectedAnswerIndexes: answer
        };
    }

    static createResponse<T extends QuestionType>(
        type: T,
        questionId: string,
        answer?: QuestionResponseValue<T>
    ): QuestionResponse<T> {
        switch (type) {
            case QuestionType.TrueFalse:
                return this.createTrueFalseResponse(questionId, answer as boolean) as QuestionResponse<T>;
            case QuestionType.MultipleChoice:
                return this.createMultipleChoiceResponse(questionId, answer as number[]) as QuestionResponse<T>;
            default:
                throw new Error(`Unsupported question type: ${type}`);
        }
    }
}