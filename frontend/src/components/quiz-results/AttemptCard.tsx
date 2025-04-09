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

    return (
        <div
            className={`
                relative cursor-pointer
                bg-base-100 transition-all duration-300
                p-4 border-l-4 hover:bg-base-200
                ${isSelected ? 'border-l-primary bg-base-200' : 'border-l-transparent'}
            `}
            onClick={() => onViewDetails(isSelected ? null : attempt.id!)}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <h3 className="font-medium flex items-center gap-2">
                        Quiz #{attempt.id?.slice(-6)}
                        {attempt.badges?.map(badge => (
                            <div
                                key={badge.type}
                                className="tooltip"
                                data-tip={`Awarded ${new Date(badge.assignedAt!).toLocaleDateString()}`}
                            >
                                <FaTrophy className="text-warning text-sm"/>
                            </div>
                        ))}
                    </h3>
                    <span className="text-sm font-medium text-primary">
                        {score.answered}/{score.total}
                    </span>
                </div>

                <div className="text-sm text-base-content/70">
                    {new Date(attempt.completedAt!).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};