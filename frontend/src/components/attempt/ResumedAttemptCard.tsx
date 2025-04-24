import React from 'react';
import {motion} from 'framer-motion';
import {ClockIcon} from '@heroicons/react/24/outline';
import {format} from 'date-fns';

interface ResumedAttemptCardProps {
    timeLimit?: number;
    startTime: string;
    onResume: () => void;
}

export const ResumedAttemptCard: React.FC<ResumedAttemptCardProps> = ({
                                                                          timeLimit,
                                                                          startTime,
                                                                          onResume
                                                                      }) => {
    const calculateRemainingTime = () => {
        const startDate = new Date(startTime);
        const elapsed = Date.now() - startDate.getTime();
        const totalTime = timeLimit! * 60 * 1000;
        const remaining = totalTime - elapsed;

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        return `${minutes}m ${seconds}s`;
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="card w-full max-w-md bg-base-100 shadow-xl"
        >
            <div className="card-body items-center text-center">
                <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="w-8 h-8 text-primary"/>
                    <h2 className="card-title">Continue Your Attempt</h2>
                </div>

                <div className="space-y-2 mb-6">
                    <p className="text-base-content/80">
                        You have an ongoing attempt started at{' '}
                        <span className="font-semibold">
                            {format(new Date(startTime), "dd MMM yyyy HH:mm")}
                        </span>
                    </p>
                    {timeLimit && (
                        <p className="text-primary font-semibold">
                            Remaining time: {calculateRemainingTime()}
                        </p>
                    )}
                </div>

                <div className="card-actions w-full">
                    <button
                        onClick={onResume}
                        className="btn btn-primary w-full gap-2"
                    >
                        Continue Quiz
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M4 15V8.5h4V4h2v4h4V8.5h-4V15H4Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};