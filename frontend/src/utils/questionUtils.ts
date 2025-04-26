import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import {QuestionResponseFactory} from "../components/question/QuestionResponseFactory";

export const isTrueFalseQuestion = (q: QuestionDTO): q is TrueFalseQuestionDTO =>
    q.type === QuestionType.TrueFalse;

export const isMultipleChoiceQuestion = (q: QuestionDTO): q is MultipleChoiceQuestionDTO =>
    q.type === QuestionType.MultipleChoice;

export const getCurrentQuestionResponse = (
    question: QuestionDTO | undefined,
    responses: QuestionResponseDTO[],
    currentIndex: number
): boolean | number[] | null => {
    if (!question || !responses[currentIndex]) return null;

    const response = responses[currentIndex];

    switch (response.responseType) {
        case QuestionType.TrueFalse:
            return (response as TrueFalseQuestionResponseDTO).selectedAnswer ?? null;
        case QuestionType.MultipleChoice:
            return (response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes ?? [];
        default:
            return null;
    }
};

export const createUpdatedResponse = (
    question: QuestionDTO,
    answer: boolean | number[] | null,
    timeSpent: number
): QuestionResponseDTO => {
    if (isTrueFalseQuestion(question)) {
        return {
            ...QuestionResponseFactory.createResponse(
                QuestionType.TrueFalse,
                question.id!,
                typeof answer === "boolean" ? answer : undefined
            ),
            timeSpent
        };
    }

    if (isMultipleChoiceQuestion(question)) {
        return {
            ...QuestionResponseFactory.createResponse(
                QuestionType.MultipleChoice,
                question.id!,
                Array.isArray(answer) ? answer : []
            ),
            timeSpent
        };
    }

    throw new Error("Question type not supported.");
};
