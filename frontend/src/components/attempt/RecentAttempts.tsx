import React from 'react';
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {FiClock} from 'react-icons/fi';

interface RecentAttemptsProps {
    attempts: QuizAttemptDTO[];
    limit?: number;
}

export const RecentAttempts: React.FC<RecentAttemptsProps> = ({
                                                                  attempts,
                                                                  limit = 3
                                                              }) => {
    const recentAttempts = attempts
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .slice(0, limit);

    return (
        <div className="bg-base-100 rounded-xl p-4">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                <FiClock className="text-primary"/>
                Recent Attempts
            </h3>
            <div className="space-y-3">
                {recentAttempts.map(attempt => (
                    <div key={attempt.id} className="p-3 bg-base-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Quiz #{attempt.id?.slice(-6)}</p>
                                <p className="text-sm text-base-content/70">
                                    {new Date(attempt.completedAt!).toLocaleDateString('it-IT', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            {(attempt.badges ?? []).length > 0 && (
                                <div className="badge badge-warning gap-1">
                                    🏆 Best Attempt
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};