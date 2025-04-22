import {
    QuizAttemptDTO,
    QuizPublicationDTO
} from "@dti-isin/backend-api-client";
import React, { useState } from "react";
import { FaTrophy } from "react-icons/fa";
import {
    calculateEarnedPoints,
    calculateTotalAvailablePoints,
    calculateScorePercentage
} from "../../utils/scoreUtils.ts";
import {formatDateTime} from "../../utils/timeUtils.ts";

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
    const totalPoints = calculateTotalAvailablePoints(publication);

    if (attempts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
                    <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-base-content/70">
                    No Attempts Yet
                </h3>
                <p className="text-sm text-base-content/50 mt-2 max-w-md">
                    Waiting for students to take the quiz
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-base-200">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-base-content">Student Attempts</h3>
                    <div className="badge badge-primary badge-sm">{attempts.length}</div>
                </div>
                {isUpdating && (
                    <div className="flex items-center gap-2 text-primary">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="text-sm font-medium">Updating...</span>
                    </div>
                )}
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-base-200">
                {attempts.map(attempt => {
                    const earnedPoints = calculateEarnedPoints(attempt);
                    const percentage = Math.round(calculateScorePercentage(earnedPoints, totalPoints));
                    const isSelected = attempt.id === selectedAttemptId;

                    return (
                        <button
                            key={attempt.id}
                            onClick={() => {
                                setSelectedAttemptId(attempt.id!);
                                onAttemptSelect(attempt);
                            }}
                            className={`
                                w-full text-left p-4 hover:bg-base-200/50 
                                transition-all duration-200 focus:outline-none
                                focus:bg-primary/5 active:bg-primary/10
                                ${isSelected ? 'bg-primary/5' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content rounded-full w-10">
                                            <span className="font-medium">
                                                {attempt.user?.name?.slice(0, 2).toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-base-content">
                                            {attempt.user?.name || 'Anonymous'}
                                        </div>
                                        <div className="text-sm text-base-content/70">
                                            {formatDateTime(attempt.completedAt!)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${
                                            percentage >= 70 ? 'text-success' :
                                                percentage >= 50 ? 'text-warning' :
                                                    'text-error'
                                        }`}>
                                            {percentage}%
                                        </div>
                                        <div className="text-sm text-base-content/70">
                                            {earnedPoints}/{totalPoints} pts
                                        </div>
                                    </div>

                                    {(attempt.badges ?? []).length > 0 && (
                                        <div className="text-warning">
                                            <FaTrophy className="text-xl transform hover:scale-110 transition-transform" />
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