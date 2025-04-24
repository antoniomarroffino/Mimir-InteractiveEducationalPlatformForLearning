import React from 'react';
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {FiClock} from 'react-icons/fi';
import {AttemptRow} from "./AttemptRow.tsx";

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
                    <AttemptRow key={attempt.id} attempt={attempt} />
                ))}
            </div>
        </div>
    );
};