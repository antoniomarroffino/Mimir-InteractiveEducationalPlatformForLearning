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

    if (attempts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-base-content/70">No Attempts Yet</h3>
                <p className="text-base-content/50 mt-2">
                    Waiting for students to take the quiz
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-base-200">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span>Student Attempts</span>
                    <span className="badge badge-primary">{attempts.length}</span>
                </h3>
                {isUpdating && (
                    <div className="flex items-center gap-2 text-primary">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="text-sm">Updating...</span>
                    </div>
                )}
            </div>

            <div className="overflow-y-auto flex-1">
                {attempts.map(attempt => {
                    const score = calculateScore(attempt);
                    const isSelected = attempt.id === selectedAttemptId;

                    return (
                        <button
                            key={attempt.id}
                            onClick={() => {
                                setSelectedAttemptId(attempt.id!);
                                onAttemptSelect(attempt);
                            }}
                            className={`
                                w-full text-left p-4 border-b border-base-200
                                hover:bg-base-200/50 transition-all duration-200
                                ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                            <span>
                                                {attempt.user?.name?.slice(0, 2).toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {attempt.user?.name || 'Anonymous'}
                                        </div>
                                        <div className="text-sm text-base-content/70">
                                            {new Date(attempt.completedAt!).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${
                                            score.percentage >= 70 ? 'text-success' :
                                                score.percentage >= 50 ? 'text-warning' :
                                                    'text-error'
                                        }`}>
                                            {score.percentage}%
                                        </div>
                                        <div className="text-sm text-base-content/70">
                                            {score.correctAnswers}/{score.totalQuestions} correct
                                        </div>
                                    </div>

                                    {(attempt.badges ?? []).length > 0 && (
                                        <div className="text-warning">
                                            <FaTrophy className="text-xl" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};