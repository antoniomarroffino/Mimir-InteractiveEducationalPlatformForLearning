import React from 'react';
import { FaceFrownIcon } from '@heroicons/react/24/solid';

interface TimeExpiredPopupProps {
    onClose?: () => void;
}

export const TimeExpiredPopup: React.FC<TimeExpiredPopupProps> = () => {
    return (
        <div className="fixed inset-0 z-50 bg-base-200/80 flex items-center justify-center">
            <div className="bg-base-100 rounded-xl shadow-xl p-8 text-center max-w-sm border border-error">
                <FaceFrownIcon className="w-12 h-12 text-error mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-error mb-2">Tempo scaduto!</h2>
                <p className="text-base text-base-content">
                    Il quiz è stato consegnato automaticamente. Speriamo ti sia divertito! 🎯
                </p>
            </div>
        </div>
    );
};
