import React from 'react';
import {
    QuizAttemptDTO,
    QuizPublicationDTO
} from '@dti-isin/backend-api-client';
import { QuizReview } from "../quiz-results/QuizReview.tsx";
import { BadgeAssignment } from "../badge/BadgeAssignment.tsx";
import { FaTimes, FaTrophy } from 'react-icons/fa';
import { AttemptHeader } from "../publication-stats/AttemptHeader.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { formatDateTime } from "../../utils/timeUtils.ts";

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
    const { user } = useAuth();
    const hasBestAttemptBadge = (attempt.badges ?? []).length > 0;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-base-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-xl">
                        📝
                    </div>
                    <div>
                        <h2 className="font-bold">Attempt Review</h2>
                        <p className="text-sm text-base-content/70">
                            {attempt.completedAt ? formatDateTime(attempt.completedAt) : 'Not completed'}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        className="btn btn-ghost btn-sm btn-circle"
                        onClick={onClose}
                        aria-label="Close attempt review"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {showBadgeAssignment && attempt.user?.azureOid && user?.azureOid && (
                        <div className="flex items-center gap-4 p-4 bg-base-100 border border-base-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <FaTrophy className="text-yellow-500 text-lg" />
                                <div>
                                    <h3 className="font-medium text-sm">Best Attempt Badge</h3>
                                    <p className="text-xs text-base-content/70">
                                        Awarded for outstanding performance
                                    </p>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <BadgeAssignment
                                    attemptId={attempt.id!}
                                    azureOID={attempt.user.azureOid}
                                    assignedBy={user.azureOid}
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
