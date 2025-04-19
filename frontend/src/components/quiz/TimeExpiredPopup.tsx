import React from 'react';
import { FaceFrownIcon } from '@heroicons/react/24/solid';

interface TimeExpiredPopupProps {
    onConfirm?: () => void;
}

export const TimeExpiredPopup: React.FC<TimeExpiredPopupProps> = ({ onConfirm }) => {
    return (
        <div className="fixed inset-0 z-50 bg-base-200/80 flex items-center justify-center">
            <div className="bg-base-100 rounded-xl shadow-xl p-8 text-center max-w-sm border border-error">
                <FaceFrownIcon className="w-12 h-12 text-error mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-error mb-2">Time's up!</h2>
                <p className="text-base text-base-content mb-6">
                    The quiz has been automatically submitted. We hope you enjoyed it! 🎯
                </p>
                {onConfirm && (
                    <button
                        onClick={onConfirm}
                        className="btn btn-error text-base-100"
                    >
                        View Results
                    </button>
                )}
            </div>
        </div>
    );
};
