import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { BadgeType } from '@dti-isin/backend-api-client';
import { useQuizAttemptCRUD } from "../../hooks/quizAttempt/useQuizAttemptCRUD.ts";
import {useAssignBadgeToHolder} from "../../hooks/badgeholder/useAssignBadgeToHolder.ts";

interface BadgeAssignmentProps {
    attemptId: string;
    azureOID: string;
    hasBadge: boolean | undefined;
    assignedBy: string;
}

export const BadgeAssignment: React.FC<BadgeAssignmentProps> = ({
                                                                    attemptId,
                                                                    azureOID,
                                                                    hasBadge,
                                                                    assignedBy
                                                                }) => {
    const { assignBadge, isAssigningBadge } = useQuizAttemptCRUD();
    const { mutateAsync: assignBadgeToHolder, isLoading: isAssigningBadgeToHolder } = useAssignBadgeToHolder();
    const [showConfirm, setShowConfirm] = React.useState(false);

    const isLoading = isAssigningBadge || isAssigningBadgeToHolder;

    const handleAssignBadge = async () => {
        try {
            await Promise.all([
                assignBadge(attemptId, BadgeType.BestAttempt),
                assignBadgeToHolder({
                    azureOID,
                    badgeType: BadgeType.BestAttempt,
                    assignedBy
                })
            ]);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to assign badge:', error);
        }
    };

    if (hasBadge) {
        return (
            <div className="tooltip tooltip-bottom" data-tip="Best Attempt Badge">
                <div className="relative">
                    <FaTrophy
                        className="text-4xl text-warning animate-pulse"
                        style={{ filter: 'drop-shadow(0 0 8px rgb(234 179 8))' }}
                    />
                    <div className="absolute -top-1 -right-1">
                        <div className="w-3 h-3 bg-success rounded-full animate-ping" />
                        <div className="w-3 h-3 bg-success rounded-full absolute top-0" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                className="group relative p-4 rounded-full transition-all duration-300 hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2"
                onClick={() => setShowConfirm(true)}
                disabled={isLoading}
            >
                <FaTrophy
                    className="text-4xl text-base-content/30 group-hover:text-warning transition-colors duration-300"
                />
                <div className="absolute inset-0 bg-warning/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </button>

            {showConfirm && (
                <dialog className="modal modal-open">
                    <div className="modal-box text-center p-6 max-w-md">
                        <div className="relative inline-block">
                            <FaTrophy className="text-7xl text-warning mx-auto mb-6" />
                            <div className="absolute top-0 left-0 w-full h-full animate-ping opacity-30">
                                <FaTrophy className="text-7xl text-warning" />
                            </div>
                        </div>

                        <h3 className="font-bold text-xl mb-3">
                            Award Best Attempt Badge
                        </h3>

                        <div className="divider"></div>

                        <p className="py-4 text-base-content/80">
                            This badge recognizes outstanding performance and will be permanently
                            associated with this attempt and the student's profile.
                        </p>

                        <div className="modal-action justify-center gap-3 mt-6">
                            <button
                                className="btn btn-ghost btn-lg"
                                onClick={() => setShowConfirm(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn btn-warning btn-lg ${isLoading ? 'loading' : ''}`}
                                onClick={handleAssignBadge}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Awarding...
                                    </>
                                ) : (
                                    'Award Badge'
                                )}
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setShowConfirm(false)}>close</button>
                    </form>
                </dialog>
            )}
        </>
    );
};