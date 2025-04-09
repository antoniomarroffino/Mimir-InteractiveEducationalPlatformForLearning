import React from 'react';
import {QuizAttemptDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {QuizReview} from "../quiz-results/QuizReview.tsx";
import {BadgeAssignment} from "../badge/BadgeAssignment.tsx";
import {FaTimes} from 'react-icons/fa';
import {AttemptHeader} from "../publication-stats/AttemptHeader.tsx";

interface AttemptDetailsProps {
    attempt: QuizAttemptDTO;
    publication: QuizPublicationDTO;
    onClose?: () => void;
    showBadgeAssignment?: boolean;
}

export const AttemptDetails: React.FC<AttemptDetailsProps> = ({
                                                                  attempt,
                                                                  publication,
                                                                  onClose,
                                                                  showBadgeAssignment = true
                                                              }) => {
    const hasBestAttemptBadge = (attempt.badges ?? []).length > 0;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-base-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content">
                        📝
                    </div>
                    <div>
                        <h2 className="font-bold">Attempt Review</h2>
                        <p className="text-sm text-base-content/70">
                            {new Date(attempt.completedAt!).toLocaleString()}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        className="btn btn-ghost btn-sm btn-circle"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {showBadgeAssignment && (
                        <div className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">Best Attempt Badge</h3>
                                <p className="text-xs text-base-content/70">
                                    Awarded for outstanding performance
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <BadgeAssignment
                                    attemptId={attempt.id!}
                                    hasBadge={hasBestAttemptBadge}
                                />
                                {hasBestAttemptBadge && (
                                    <span className="badge badge-success badge-sm">Awarded</span>
                                )}
                            </div>
                        </div>
                    )}

                    <QuizReview
                        attempt={attempt}
                        publication={publication}
                        CustomHeader={AttemptHeader}
                        showStats={true}
                    />
                </div>
            </div>
        </div>
    );
};