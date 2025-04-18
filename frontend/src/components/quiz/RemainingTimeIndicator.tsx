import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface RemainingTimeIndicatorProps {
    timeRemaining: number;
}

export const RemainingTimeIndicator: React.FC<RemainingTimeIndicatorProps> = ({ timeRemaining }) => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div
            className={`w-fit self-start bg-base-100 p-3 rounded-xl shadow-lg flex items-center gap-2 mb-4 ${
                timeRemaining < 30 ? 'animate-pulse ring-2 ring-error/30' : ''
            }`}
        >
            <ClockIcon className="w-5 h-5 text-primary" />
            <span className={`font-mono text-lg ${timeRemaining < 60 ? 'text-error' : ''}`}>
                {formatted}
            </span>
        </div>
    );
};
