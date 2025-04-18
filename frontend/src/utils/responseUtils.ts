import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';

export const isResponseCorrect = (question: QuestionDTO, response: QuestionResponseDTO): boolean => {
    if (question.type === QuestionType.TrueFalse) {
        const trueFalseQuestion = question as TrueFalseQuestionDTO;
        const trueFalseResponse = response as TrueFalseQuestionResponseDTO;
        return trueFalseResponse.selectedAnswer === trueFalseQuestion.correctAnswer;
    }

    if (question.type === QuestionType.MultipleChoice) {
        const multipleChoiceQuestion = question as MultipleChoiceQuestionDTO;
        const multipleChoiceResponse = response as MultipleChoiceQuestionResponseDTO;

        const responseIndexes = multipleChoiceResponse.selectedAnswerIndexes || [];
        const correctIndexes = multipleChoiceQuestion.correctAnswerIndexes;

        return JSON.stringify(responseIndexes.sort()) === JSON.stringify(correctIndexes.sort());
    }

    return false;
};

export const checkIfAnswered = (question: QuestionDTO, response?: QuestionResponseDTO): boolean => {
    if (!response) return false;

    if (question.type === QuestionType.TrueFalse) {
        return (response as TrueFalseQuestionResponseDTO).selectedAnswer !== undefined;
    }

    if (question.type === QuestionType.MultipleChoice) {
        const mcResponse = response as MultipleChoiceQuestionResponseDTO;
        return !!(mcResponse.selectedAnswerIndexes && mcResponse.selectedAnswerIndexes.length > 0);
    }

    return false;
};