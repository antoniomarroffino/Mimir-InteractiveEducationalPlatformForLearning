import React from 'react';
import {useGetQuizAttemptsByUser} from "../../hooks/quizAttempt/useGetQuizAttemptsByUser";
import {useAuth} from "../../hooks/useAuth";
import {Link} from 'react-router-dom';
import {FiArrowRight} from 'react-icons/fi';
import {RecentAttempts} from "../attempt/RecentAttempts.tsx";

export const QuizHistorySection: React.FC = () => {
    const {user} = useAuth();
    const {data: attempts = [], isLoading: isLoadingAttempts} = useGetQuizAttemptsByUser(user?.azureOid);

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Your Quiz Journey
                        </h2>
                        <p className="text-base-content/70 mt-2">
                            Track your progress and achievements
                        </p>
                    </div>

                    <div className="w-full sm:w-auto">
                        <div className="stats bg-base-100 shadow w-full sm:w-auto">
                            <div className="stat px-4 py-2 sm:py-4">
                                <div className="stat-title text-sm sm:text-base">Total Attempts</div>
                                <div className="stat-value text-primary text-2xl sm:text-3xl">
                                    {attempts.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoadingAttempts ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : attempts.length > 0 ? (
                    <div className="space-y-6">
                        <RecentAttempts attempts={attempts} limit={3}/>

                        <div className="flex justify-center">
                            <Link
                                to="/quiz-review"
                                className="btn btn-primary gap-2"
                            >
                                View All Attempts
                                <FiArrowRight/>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-base-100 rounded-xl">
                        <div className="text-4xl mb-4">📚</div>
                        <p className="text-lg font-medium text-base-content/70">
                            Start your learning journey
                        </p>
                        <p className="text-sm text-base-content/50 mt-2">
                            Complete your first quiz to see your progress here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};