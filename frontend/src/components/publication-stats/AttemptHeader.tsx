import React from 'react';
import {QuizAttemptDTO} from '@dti-isin/backend-api-client';
import {QuizDuration} from "../quiz-results/QuizDuration.tsx";

interface AttemptHeaderProps {
    attempt: QuizAttemptDTO;
}

export const AttemptHeader: React.FC<AttemptHeaderProps> = ({attempt}) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <span>Quiz Results</span>
                <span className="text-sm font-normal text-base-content/70">
                    ({attempt.user?.name || 'Anonymous'})
                </span>
            </h2>
            <div className="text-sm text-base-content/70">
                <QuizDuration
                    startedAt={attempt.startedAt}
                    completedAt={attempt.completedAt}
                />
            </div>
        </div>
    );
};
