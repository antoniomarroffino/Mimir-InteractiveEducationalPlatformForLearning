import React from 'react';
import { QuizAttemptDTO } from '@dti-isin/backend-api-client';
import { calculateDurationInSeconds, formatDuration } from '../../utils/timeUtils';

interface AttemptHeaderProps {
    attempt: QuizAttemptDTO;
}

export const AttemptHeader: React.FC<AttemptHeaderProps> = ({ attempt }) => {
    const durationSeconds = calculateDurationInSeconds(attempt.startedAt, attempt.completedAt);

    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <span>Quiz Results</span>
                <span className="text-sm font-normal text-base-content/70">
                    ({attempt.user?.name || 'Anonymous'})
                </span>
            </h2>
            <div className="text-sm text-base-content/70">
                {durationSeconds > 0 && (
                    <span>Duration: {formatDuration(durationSeconds)}</span>
                )}
            </div>
        </div>
    );
};
