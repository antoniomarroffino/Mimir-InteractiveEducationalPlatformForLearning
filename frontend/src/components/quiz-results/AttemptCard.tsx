import React from 'react';
import {QuizAttemptDTO} from '@dti-isin/backend-api-client';

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
    const calculateScore = (): number => {
        if (!attempt.responses) return 0;
        return Math.round((attempt.responses.length / (attempt.responses.length || 1)) * 100);
    };

    const handleClick = () => {
        if (isSelected) {
            onViewDetails(null);
        } else {
            onViewDetails(attempt.id!);
        }
    };

    return (
        <div className={`card bg-base-100 shadow-lg transition-all ${
            isSelected
                ? 'ring-2 ring-primary shadow-xl'
                : 'hover:shadow-xl'
        }`}>
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="card-title text-lg">
                            Quiz #{attempt.id?.slice(-6)}
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Completed at {new Date(attempt.completedAt!).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className={`badge badge-lg ${
                            calculateScore() >= 70 ? 'badge-success' :
                                calculateScore() >= 50 ? 'badge-warning' :
                                    'badge-error'
                        }`}>
                            {calculateScore()}%
                        </span>
                        <button
                            className={`btn btn-sm ${
                                isSelected ? 'btn-ghost' : 'btn-primary'
                            }`}
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