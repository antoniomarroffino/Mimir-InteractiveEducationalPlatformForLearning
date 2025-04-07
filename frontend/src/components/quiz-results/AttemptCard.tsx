import React, {useMemo} from 'react';
import {
    MultipleChoiceQuestionResponseDTO,
    QuizAttemptDTO,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import {FaTrophy} from "react-icons/fa";

interface AttemptCardProps {
    attempt: QuizAttemptDTO;
    onViewDetails: (attemptId: string | null) => void;
    isSelected?: boolean;
}

export const AttemptCard: React.FC<AttemptCardProps> = ({
                                                            attempt,
                                                            onViewDetails,
                                                            isSelected = false
                                                        }) => {
    const score = useMemo(() => {
        const answeredResponses = attempt.responses?.filter(response => {
            if (!response) return false;

            if ('selectedAnswer' in response) {
                const tfResponse = response as TrueFalseQuestionResponseDTO;
                return tfResponse.selectedAnswer !== null && tfResponse.selectedAnswer !== undefined;
            }

            if ('selectedAnswerIndexes' in response) {
                const mcResponse = response as MultipleChoiceQuestionResponseDTO;
                return mcResponse.selectedAnswerIndexes && mcResponse.selectedAnswerIndexes.length > 0;
            }

            return false;
        }) || [];

        const totalQuestions = attempt.responses?.length || 0;
        const answeredCount = answeredResponses.length;

        return {
            answered: answeredCount,
            total: totalQuestions
        };
    }, [attempt]);

    const handleClick = () => {
        onViewDetails(isSelected ? null : attempt.id!);
    };

    return (
        <div
            className={`
                relative overflow-hidden
                card bg-base-100 shadow-lg transition-all duration-300
                ${isSelected ? 'ring-2 ring-primary shadow-xl' : 'hover:shadow-xl'}
            `}
        >
            {attempt.badges && attempt.badges.length > 0 && (
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24">
                    <div
                        className="absolute transform rotate-45 bg-warning text-warning-content py-1 px-8 text-xs font-bold right-0 top-8">
                        🏆 Best Attempt
                    </div>
                </div>
            )}

            <div className="card-body">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="card-title text-lg flex items-center gap-2">
                            Quiz #{attempt.id?.slice(-6)}
                            {attempt.badges?.map(badge => (
                                <div
                                    key={badge.type}
                                    className="tooltip"
                                    data-tip={`Awarded ${new Date(badge.assignedAt!).toLocaleDateString()}`}
                                >
                                    <FaTrophy className="text-warning text-xl"/>
                                </div>
                            ))}
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Completed {new Date(attempt.completedAt!).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="font-medium">
                                {score.answered}/{score.total}
                            </span> {score.answered === 1 ? 'question' : 'questions'} answered
                        </div>
                        <button
                            className={`btn btn-sm ${isSelected ? 'btn-ghost' : 'btn-primary'}`}
                            onClick={handleClick}
                        >
                            {isSelected ? 'Hide' : 'Details'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};