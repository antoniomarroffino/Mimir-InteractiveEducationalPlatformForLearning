import React from 'react';
import { QuizAttemptDTO } from '@dti-isin/backend-api-client';

interface AttemptsTableMiniProps {
    attempts: QuizAttemptDTO[];
    selectedAttempt: QuizAttemptDTO | null;
    onSelect: (attempt: QuizAttemptDTO) => void;
}

export const AttemptsTableMini: React.FC<AttemptsTableMiniProps> = ({
                                                                        attempts,
                                                                        selectedAttempt,
                                                                        onSelect,
                                                                    }) => {
    if (!attempts || attempts.length === 0) {
        return (
            <div className="text-sm text-base-content/50 italic text-center mt-4">
                No attempts found.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-base-content/70 mb-2">
                Select Attempt
            </h4>
            <div className="overflow-y-auto max-h-[400px] pr-1">
                {attempts.map((attempt) => {
                    const isSelected = selectedAttempt?.id === attempt.id;
                    return (
                        <button
                            key={attempt.id}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-colors duration-200 border border-base-200 hover:bg-base-200/50 ${
                                isSelected ? 'bg-primary/10 border-primary' : ''
                            }`}
                            onClick={() => onSelect(attempt)}
                        >
                            <div className="font-medium truncate">
                                {attempt.user?.name || 'Anonymous'}
                            </div>
                            <div className="text-xs text-base-content/60 truncate">
                                {new Date(attempt.completedAt!).toLocaleString()}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};