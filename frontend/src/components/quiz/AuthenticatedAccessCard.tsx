import React from 'react';
import {ClockIcon} from '@heroicons/react/24/outline';
import {motion} from 'framer-motion';
import {BsRocket, BsTrophy} from 'react-icons/bs';

interface AuthenticatedAccessCardProps {
    onStart: () => void;
    loading: boolean;
    timeLimit?: string;
}

export const AuthenticatedAccessCard: React.FC<AuthenticatedAccessCardProps> = ({
                                                                                    onStart,
                                                                                    loading,
                                                                                    timeLimit,
                                                                                }) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="relative w-full max-w-md mx-auto"
        >
            <motion.div
                className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                animate={{scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1]}}
                transition={{duration: 5, repeat: Infinity, ease: "easeInOut"}}
            />

            <div className="card w-full bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl backdrop-blur-sm border border-white/10 relative z-10">
                <div className="card-body items-center text-center p-8">
                    <motion.div
                        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                        animate={{scale: [1, 1.1, 1]}}
                        transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}
                    >
                        <BsTrophy className="w-10 h-10 text-primary"/>
                    </motion.div>

                    <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Ready to Excel?
                    </h3>

                    <p className="text-base-content/70 mb-4">
                        Your progress will be tracked and saved!
                    </p>

                    <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 mb-6 text-sm sm:text-base">
                        <ClockIcon className="w-5 h-5 text-primary"/>
                        <span className="text-primary font-medium">
                            {timeLimit || "No time limit"}
                        </span>
                    </div>

                    <motion.button
                        onClick={onStart}
                        disabled={loading}
                        className="btn btn-primary btn-wide gap-2 text-white"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"/>
                                Preparing Quiz...
                            </>
                        ) : (
                            <>
                                Start the Quiz
                                <BsRocket className="w-4 h-4"/>
                            </>
                        )}
                    </motion.button>

                    <p className="text-xs text-base-content/50 mt-4">
                        Progress tracked • Results saved
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
