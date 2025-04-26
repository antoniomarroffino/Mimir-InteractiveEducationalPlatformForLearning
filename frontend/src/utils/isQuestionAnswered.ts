import {
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    TrueFalseQuestionResponseDTO
} from "@dti-isin/backend-api-client";

export const getUnansweredQuestions = (questions: QuestionDTO[], responses: QuestionResponseDTO[]): number[] => {
    return questions
        .map((q, i) => {
            const response = responses[i];
            if (!response) return i + 1;
            switch (q.type) {
                case QuestionType.TrueFalse:
                    return typeof (response as TrueFalseQuestionResponseDTO).selectedAnswer === 'boolean' ? null : i + 1;
                case QuestionType.MultipleChoice:
                    return ((response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes?.length ?? 0) > 0 ? null : i + 1;
                default:
                    return i + 1;
            }
        })
        .filter((v): v is number => v !== null);
};
