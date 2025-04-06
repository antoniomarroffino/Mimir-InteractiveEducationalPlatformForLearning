import React from 'react';
import { QuizAttemptDTO, QuizPublicationDTO, BadgeType } from '@dti-isin/backend-api-client';
import { QuizReview } from "../quiz-results/QuizReview.tsx";
import { BadgeAssignment } from "../badge/BadgeAssignment.tsx";
import { FaTimes } from 'react-icons/fa';
import {AttemptHeader} from "./AttemptHeader.tsx";

interface AttemptDetailsProps {
    attempt: QuizAttemptDTO;
    publication: QuizPublicationDTO;
    onClose?: () => void;
}

export const AttemptDetails: React.FC<AttemptDetailsProps> = ({
                                                                  attempt,
                                                                  publication,
                                                                  onClose
                                                              }) => {
    const hasBestAttemptBadge = attempt.badges?.some(
        badge => badge.type === BadgeType.BestAttempt
    );

    return (
        <div className="p-4">
            {/* Header con pulsante di chiusura */}
            <div className="relative mb-8">
                {onClose && (
                    <button
                        className="absolute right-0 top-0 btn btn-ghost btn-circle"
                        onClick={onClose}
                    >
                        <FaTimes className="text-lg" />
                    </button>
                )}
                <h2 className="text-2xl font-bold text-center">
                    Attempt Details
                </h2>
            </div>

            {/* Sezione Badge */}
            <div className="mb-8">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h3 className="card-title text-center justify-center mb-4">
                            Achievement Badges
                        </h3>
                        <div className="flex justify-center items-center gap-8">
                            <div className="text-center">
                                <div className="mb-2 text-base-content/70">
                                    Best Attempt Badge
                                </div>
                                <div className="p-4 bg-base-100 rounded-lg shadow-inner">
                                    <BadgeAssignment
                                        attemptId={attempt.id!}
                                        hasBadge={hasBestAttemptBadge}
                                    />
                                </div>
                                {hasBestAttemptBadge && (
                                    <div className="mt-2 text-sm text-success">
                                        Awarded!
                                    </div>
                                )}
                            </div>
                            {/* Spazio per altri badge futuri */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenuto della revisione */}
            <div className="mt-8">
                <QuizReview
                    attempt={attempt}
                    publication={publication}
                    CustomHeader={AttemptHeader}
                    showStats={true}
                />
            </div>
        </div>
    );
};