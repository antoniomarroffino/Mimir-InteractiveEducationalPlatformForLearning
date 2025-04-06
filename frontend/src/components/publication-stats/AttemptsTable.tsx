import {
    QuizAttemptDTO,
    QuizPublicationDTO,
    QuestionType,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import React, {useState} from "react";
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
    const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-base-content/80">
                    Student Attempts
                </h2>
                {isUpdating && (
                    <div className="flex items-center gap-2 text-primary animate-pulse">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="text-sm font-medium">Refreshing data...</span>
                    </div>
                )}
            </div>

            <div className="rounded-xl shadow-lg bg-base-100">
                <div className="overflow-x-visible">
                    <table className="table w-full">
                        <thead>
                        <tr className="border-b border-base-200">
                            <th className="bg-base-100 text-base-content/60 font-medium px-6 py-4">Student</th>
                            <th className="bg-base-100 text-base-content/60 font-medium px-6 py-4 hidden md:table-cell">Timing</th>
                            <th className="bg-base-100 text-base-content/60 font-medium px-6 py-4">Performance</th>
                            <th className="bg-base-100 text-base-content/60 font-medium px-6 py-4">Recognition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attempts.map(attempt => {
                            const score = calculateScore(attempt);
                            const isSelected = attempt.id === selectedAttemptId;

                            return (
                                <tr
                                    key={attempt.id}
                                    onClick={() => {
                                        setSelectedAttemptId(attempt.id!);
                                        onAttemptSelect(attempt);
                                    }}
                                    className={`
                                            border-b border-base-200 cursor-pointer
                                            transition-all duration-200
                                            hover:bg-base-200/50
                                            ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''}
                                        `}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                        <span className="text-xs">
                                                            {attempt.userAzureOID?.slice(0, 2).toUpperCase() || 'A'}
                                                        </span>
                                                </div>
                                            </div>
                                            <div className="font-medium">
                                                {attempt.userAzureOID || 'Anonymous'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-sm text-base-content/70">
                                                Started: {new Date(attempt.startedAt!).toLocaleTimeString()}
                                            </div>
                                            <div className="text-sm text-base-content/70">
                                                Completed: {new Date(attempt.completedAt!).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`radial-progress ${
                                                score.percentage >= 70 ? 'text-success' :
                                                    score.percentage >= 50 ? 'text-warning' :
                                                        'text-error'
                                            }`} style={{"--value": score.percentage, "--size": "2.5rem"} as never}>
                                                <span className="text-xs font-bold">{score.percentage}%</span>
                                            </div>
                                            <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {score.correctAnswers}/{score.totalQuestions} correct
                                                    </span>
                                                {score.answeredQuestions < score.totalQuestions && (
                                                    <span className="text-sm text-base-content/70">
                                                            {score.answeredQuestions} answered
                                                        </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {attempt.badges?.map(badge => (
                                                <div
                                                    key={badge.type}
                                                    className="tooltip"
                                                    data-tip={`Awarded by ${badge.assignedBy}`}
                                                >
                                                    <FaTrophy className="text-2xl text-warning" />
                                                </div>
                                            ))}
                                            {!attempt.badges?.length && (
                                                <span className="text-sm text-base-content/50">
                                                        No badges yet
                                                    </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {attempts.length === 0 && (
                <div className="text-center py-12 bg-base-200 rounded-xl mt-6">
                    <div className="text-base-content/50 font-medium">
                        No attempts recorded yet
                    </div>
                    <p className="text-sm text-base-content/40 mt-1">
                        Students haven't taken this quiz yet
                    </p>
                </div>
            )}
        </div>
    );
};