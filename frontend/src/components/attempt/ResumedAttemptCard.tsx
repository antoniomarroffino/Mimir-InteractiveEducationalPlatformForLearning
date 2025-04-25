import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { formatMinutesDuration, formatQuestionTime } from "../../utils/timeUtils";
import {PlayCircleIcon} from "lucide-react";

interface ResumedAttemptCardProps {
    timeLimit?: number;
    startTime: string;
    quizAttemptTimeRemaining?: number;
    onResume: () => void;
}

export const ResumedAttemptCard: React.FC<ResumedAttemptCardProps> = ({
                                                                          timeLimit,
                                                                          startTime,
                                                                          quizAttemptTimeRemaining,
                                                                          onResume,
                                                                      }) => {
    const remaining = quizAttemptTimeRemaining ?? 0;
    const formattedStart = format(new Date(startTime), 'dd MMM yyyy HH:mm');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md mx-auto"
        >
            {/* decorative animated background */}
            <motion.div
                className="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="card w-full bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl backdrop-blur-sm border border-white/10 relative z-10">
                <div className="card-body items-center text-center p-8">
                    {/* Icon */}
                    <motion.div
                        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ClockIcon className="w-10 h-10 text-primary" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Continue Your Attempt
                    </h3>

                    {/* Details */}
                    <div className="text-base-content/70 mb-4 space-y-1">
                        <p>You started on:</p>
                        <p className="font-semibold">{formattedStart}</p>
                        {timeLimit && (
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <p className="text-primary font-medium">
                                    Remaining: {formatQuestionTime(remaining)}
                                </p>
                                <span className="text-base-content/50">/</span>
                                <p className="text-primary font-medium">
                                    Total: {formatMinutesDuration(timeLimit)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Resume Button */}
                    <motion.button
                        onClick={onResume}
                        className="btn btn-primary btn-wide gap-2 text-white mb-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Continue Quiz
                        <PlayCircleIcon className="w-5 h-5" />
                    </motion.button>

                    <p className="text-xs text-base-content/50">
                        Your progress is saved and can be resumed anytime.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
