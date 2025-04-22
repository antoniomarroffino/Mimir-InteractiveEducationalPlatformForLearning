import React from 'react';
import {QuizAttemptDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {QuizReview} from "../quiz-results/QuizReview";
import {BadgeAssignment} from "../badge/BadgeAssignment";
import {FaCheckCircle, FaTimes, FaTrophy} from 'react-icons/fa';
import {AttemptHeader} from "../publication-stats/AttemptHeader";
import {useAuth} from "../../hooks/useAuth";
import {formatDateTime} from "../../utils/timeUtils";

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
    const {user} = useAuth();
    const hasBestAttemptBadge = (attempt.badges ?? []).length > 0;

    if (!attempt) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
                    <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-base-content/70">
                    No Attempt Selected
                </h3>
                <p className="text-sm text-base-content/50 mt-2 max-w-md">
                    Select an attempt to view details
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-base-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary
                                  flex items-center justify-center text-primary-content shadow-md">
                        <span className="text-2xl">📝</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-base-content">
                            {attempt.user?.name || 'Anonymous'}'s Attempt
                        </h2>
                        <p className="text-sm text-base-content/70 flex items-center gap-2">
                            <span>Completed: {formatDateTime(attempt.completedAt!)}</span>
                        </p>
                    </div>
                </div>

                {onClose && (
                    <button
                        className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
                        onClick={onClose}
                        aria-label="Close attempt review"
                    >
                        <FaTimes className="w-5 h-5"/>
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                    {showBadgeAssignment && attempt.user?.azureOid && user?.azureOid && (
                        <div className="bg-base-200 rounded-xl p-4 border border-base-300
                                      hover:border-primary/20 transition-colors">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-warning/10
                                                  flex items-center justify-center">
                                        <FaTrophy className="text-warning text-xl"/>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-base">Best Attempt Badge</h3>
                                        <p className="text-sm text-base-content/70">
                                            Recognition for outstanding quiz performance
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <BadgeAssignment
                                        attemptId={attempt.id!}
                                        azureOID={attempt.user.azureOid}
                                        assignedBy={user.azureOid}
                                        hasBadge={hasBestAttemptBadge}
                                    />
                                    {hasBestAttemptBadge && (
                                        <div className="badge badge-success gap-2 py-3">
                                            <FaCheckCircle className="w-3 h-3"/>
                                            <span className="font-medium">Awarded</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-base-200 p-4 rounded-xl overflow-hidden">
                        <QuizReview
                            attempt={attempt}
                            publication={publication}
                            CustomHeader={AttemptHeader}
                            showStats={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};