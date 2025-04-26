import React from 'react';
import {calculateDurationInSeconds, formatDuration} from '../../utils/timeUtils';

interface QuizDurationProps {
    startedAt?: string;
    completedAt?: string;
    className?: string;
}

export const QuizDuration: React.FC<QuizDurationProps> = ({startedAt, completedAt, className}) => {
    const durationSeconds = calculateDurationInSeconds(startedAt, completedAt);

    if (!durationSeconds || durationSeconds <= 0) {
        return null;
    }

    return (
        <span className={className}>
            Duration: {formatDuration(durationSeconds)}
        </span>
    );
};
