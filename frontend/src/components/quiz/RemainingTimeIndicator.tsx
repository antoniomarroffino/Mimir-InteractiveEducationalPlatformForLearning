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
            className={`min-h-[48px] bg-primary/10 px-3 py-2 rounded-xl flex items-center gap-2 ${
                timeRemaining < 30 ? 'animate-pulse ring-2 ring-error/30' : ''
            }`}
        >
            <ClockIcon className="w-5 h-5 text-primary" />
            <span className={`font-mono text-sm md:text-base leading-none ${timeRemaining < 60 ? 'text-error' : ''}`}>
                {formatted}
            </span>
        </div>
    );
};
