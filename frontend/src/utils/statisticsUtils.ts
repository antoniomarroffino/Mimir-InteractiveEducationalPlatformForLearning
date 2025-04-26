import {QuestionDTO, QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {isResponseCorrect} from "./responseUtils";

export interface QuestionStat {
    question: QuestionDTO;
    totalResponses: number;
    correctResponses: number;
    percentageCorrect: number;
    averageTimeSpent: number;
}

export const calculateQuestionStats = (
    questions: QuestionDTO[],
    attempts: QuizAttemptDTO[]
): QuestionStat[] => {
    return questions.map(question => {
        const responses = attempts.flatMap(attempt =>
            attempt.responses?.filter(response =>
                response.questionId === question.id
            ) || []
        );

        const totalResponses = responses.length;
        const correctResponses = responses.filter(response =>
            isResponseCorrect(question, response)
        ).length;

        const averageTimeSpent = responses.reduce((acc, response) =>
            acc + (response.timeSpent || 0), 0) / (totalResponses || 1);

        return {
            question,
            totalResponses,
            correctResponses,
            percentageCorrect: totalResponses > 0
                ? (correctResponses * 100) / totalResponses
                : 0,
            averageTimeSpent
        };
    });
};
