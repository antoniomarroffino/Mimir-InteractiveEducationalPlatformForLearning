import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { BadgeType } from '@dti-isin/backend-api-client';
import {useQuizAttemptCRUD} from "../../hooks/quizAttempt/useQuizAttemptCRUD.ts";

interface BadgeAssignmentProps {
    attemptId: string;
    hasBadge: boolean | undefined;
}

export const BadgeAssignment: React.FC<BadgeAssignmentProps> = ({
                                                                    attemptId,
                                                                    hasBadge
                                                                }) => {
    const { assignBadge, isAssigningBadge } = useQuizAttemptCRUD();
    const [showConfirm, setShowConfirm] = React.useState(false);

    const handleAssignBadge = async () => {
        try {
            await assignBadge(attemptId, BadgeType.BestAttempt);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to assign badge:', error);
        }
    };

    if (hasBadge) {
        return (
            <div className="tooltip" data-tip="Best Attempt Badge">
                <FaTrophy
                    className="text-4xl text-warning animate-pulse"
                    style={{ filter: 'drop-shadow(0 0 8px rgb(234 179 8))' }}
                />
            </div>
        );
    }

    return (
        <>
            <button
                className="group relative p-4 rounded-full transition-all duration-300 hover:bg-base-300"
                onClick={() => setShowConfirm(true)}
                disabled={isAssigningBadge}
            >
                <FaTrophy
                    className="text-4xl text-base-content/30 group-hover:text-warning transition-colors duration-300"
                />
                <div className="absolute inset-0 bg-warning/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </button>

            {showConfirm && (
                <dialog className="modal modal-open">
                    <div className="modal-box text-center">
                        <FaTrophy className="text-6xl text-warning mx-auto mb-4" />
                        <h3 className="font-bold text-lg mb-2">
                            Assign Best Attempt Badge
                        </h3>
                        <p className="py-4">
                            This badge recognizes outstanding performance in this quiz attempt.
                            Are you sure you want to award it?
                        </p>
                        <div className="modal-action justify-center gap-2">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn btn-primary ${isAssigningBadge ? 'loading' : ''}`}
                                onClick={handleAssignBadge}
                                disabled={isAssigningBadge}
                            >
                                {isAssigningBadge ? 'Assigning...' : 'Award Badge'}
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