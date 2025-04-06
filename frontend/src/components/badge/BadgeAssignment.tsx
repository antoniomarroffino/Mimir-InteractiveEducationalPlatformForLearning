import React from 'react';
import {FaTrophy} from 'react-icons/fa';
import {BadgeType} from '@dti-isin/backend-api-client';
import {useQuizAttemptCRUD} from "../../hooks/quizAttempt/useQuizAttemptCRUD.ts";

interface BadgeAssignmentProps {
    attemptId: string;
    hasBadge: boolean | undefined;
}

export const BadgeAssignment: React.FC<BadgeAssignmentProps> = ({
                                                                    attemptId,
                                                                    hasBadge
                                                                }) => {
    const {assignBadge, isAssigningBadge} = useQuizAttemptCRUD();
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
                <FaTrophy className="text-2xl text-warning animate-pulse"/>
            </div>
        );
    }

    return (
        <>
            <button
                className="btn btn-ghost btn-circle"
                onClick={() => setShowConfirm(true)}
                disabled={isAssigningBadge}
            >
                <FaTrophy className="text-2xl text-base-content/50 hover:text-warning transition-colors"/>
            </button>

            {showConfirm && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Assign Best Attempt Badge</h3>
                        <p className="py-4">
                            Are you sure you want to assign the Best Attempt badge to this attempt?
                        </p>
                        <div className="modal-action">
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
                                {isAssigningBadge ? 'Assigning...' : 'Assign Badge'}
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