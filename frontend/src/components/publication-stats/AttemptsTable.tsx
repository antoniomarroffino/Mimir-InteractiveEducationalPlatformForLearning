import {
    QuizAttemptDTO,
    QuizPublicationDTO,
    QuestionType,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import React from "react";
import {FaTrophy} from "react-icons/fa";

interface AttemptsTableProps {
    attempts: QuizAttemptDTO[];
    publication: QuizPublicationDTO;
    onAttemptSelect: (attempt: QuizAttemptDTO) => void;
    isUpdating?: boolean;
}

export const AttemptsTable: React.FC<AttemptsTableProps> = ({
                                                                attempts,
                                                                publication,
                                                                onAttemptSelect,
                                                                isUpdating
                                                            }) => {
    const calculateScore = (attempt: QuizAttemptDTO) => {
        const answeredQuestions = attempt.responses?.filter(r => r !== null).length || 0;
        const correctAnswers = attempt.responses?.filter(r => {
            const question = publication.questions?.find(q => q.id === r?.questionId);
            if (!question || !r) return false;

            if (question.type === QuestionType.TrueFalse) {
                return (r as TrueFalseQuestionResponseDTO).selectedAnswer ===
                    (question as TrueFalseQuestionDTO).correctAnswer;
            }

            if (question.type === QuestionType.MultipleChoice) {
                const mcResponse = r as MultipleChoiceQuestionResponseDTO;
                const mcQuestion = question as MultipleChoiceQuestionDTO;
                return JSON.stringify(mcResponse.selectedAnswerIndexes?.sort()) ===
                    JSON.stringify(mcQuestion.correctAnswerIndexes.sort());
            }

            return false;
        }).length || 0;

        const totalQuestions = publication.questions?.length || 0;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        return {
            correctAnswers,
            totalQuestions,
            answeredQuestions,
            percentage
        };
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Individual Attempts</h2>
                {isUpdating && (
                    <div className="flex items-center gap-2 text-primary">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="text-sm">Updating results...</span>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr className="bg-base-200">
                        <th className="font-bold">User</th>
                        <th className="font-bold">Started At</th>
                        <th className="font-bold">Completed At</th>
                        <th className="font-bold">Score</th>
                        <th className="font-bold">Badges</th>
                    </tr>
                    </thead>
                    <tbody>
                    {attempts.map(attempt => {
                        const score = calculateScore(attempt);
                        return (
                            <tr
                                key={attempt.id}
                                className="hover:bg-base-200 cursor-pointer transition-colors"
                                onClick={() => onAttemptSelect(attempt)}
                            >
                                <td className="font-medium">
                                    {attempt.userAzureOID || 'Anonymous'}
                                </td>
                                <td>
                                    {attempt.startedAt
                                        ? new Date(attempt.startedAt).toLocaleString()
                                        : 'N/A'}
                                </td>
                                <td>
                                    {attempt.completedAt
                                        ? new Date(attempt.completedAt).toLocaleString()
                                        : 'N/A'}
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium">
                                            {score.correctAnswers}/{score.totalQuestions}
                                        </div>
                                        <div className={`badge ${
                                            score.percentage >= 70
                                                ? 'badge-success'
                                                : score.percentage >= 50
                                                    ? 'badge-warning'
                                                    : 'badge-error'
                                        }`}>
                                            {score.percentage}%
                                        </div>
                                        {score.answeredQuestions < score.totalQuestions && (
                                            <div className="badge badge-ghost text-xs">
                                                {score.answeredQuestions} answered
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {attempt.badges?.map(badge => (
                                        <div key={badge.type} className="tooltip" data-tip={`Assigned by ${badge.assignedBy}`}>
                                            <FaTrophy className="text-warning" />
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            {attempts.length === 0 && (
                <div className="text-center py-8 text-base-content/70">
                    No attempts yet
                </div>
            )}
        </div>
    );
};