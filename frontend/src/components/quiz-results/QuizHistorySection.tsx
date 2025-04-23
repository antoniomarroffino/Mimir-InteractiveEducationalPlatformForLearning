import React from 'react';
import {useGetQuizAttemptsByUser} from "../../hooks/quizAttempt/useGetQuizAttemptsByUser";
import {useAuth} from "../../hooks/useAuth";
import {Link} from 'react-router-dom';
import {FiArrowRight, FiBook} from 'react-icons/fi';
import {RecentAttempts} from "../attempt/RecentAttempts.tsx";
import {motion} from 'framer-motion';

export const QuizHistorySection: React.FC = () => {
    const {user} = useAuth();
    const {data: attempts = [], isLoading: isLoadingAttempts} = useGetQuizAttemptsByUser(user?.azureOid);

    if (!user) return null;

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="container mx-auto px-4 py-6 sm:py-8"
        >
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.2}}
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Your Quiz Journey
                        </h2>
                        <p className="text-sm sm:text-base text-base-content/70 mt-1 sm:mt-2">
                            Track your progress and achievements
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.3}}
                        className="w-full sm:w-auto"
                    >
                        <div className="stats bg-base-100 shadow w-full sm:w-auto">
                            <div className="stat px-3 sm:px-4 py-2 sm:py-4">
                                <div className="stat-title text-xs sm:text-sm md:text-base">Total Attempts</div>
                                <div className="stat-value text-primary text-xl sm:text-2xl md:text-3xl">
                                    {attempts.length}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                >
                    {isLoadingAttempts ? (
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-sm text-base-content/70 mt-4">Loading your attempts...</p>
                        </div>
                    ) : attempts.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            <RecentAttempts attempts={attempts} limit={3}/>

                            <div className="flex justify-center pt-4">
                                <Link
                                    to="/quiz-review"
                                    className="btn btn-primary gap-2 w-full sm:w-auto group"
                                >
                                    View All Attempts
                                    <FiArrowRight className="transition-transform group-hover:translate-x-1"/>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            className="text-center py-8 sm:py-12 bg-base-100 rounded-lg sm:rounded-xl px-4"
                            initial={{scale: 0.95}}
                            animate={{scale: 1}}
                            transition={{delay: 0.5}}
                        >
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiBook className="text-2xl sm:text-3xl text-primary"/>
                            </div>
                            <h3 className="text-lg sm:text-xl font-medium text-base-content mb-2">
                                Start your learning journey
                            </h3>
                            <p className="text-sm sm:text-base text-base-content/50 max-w-md mx-auto">
                                Complete your first quiz to see your progress here
                            </p>
                            <Link
                                to="#quiz-section"
                                className="btn btn-primary btn-sm sm:btn-md mt-6"
                            >
                                Join a Quiz
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};