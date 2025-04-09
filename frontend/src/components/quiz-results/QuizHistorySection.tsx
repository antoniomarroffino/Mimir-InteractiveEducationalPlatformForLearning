import React from 'react';
import { useGetQuizAttemptsByUser } from "../../hooks/quizAttempt/useGetQuizAttemptsByUser";
import { useAuth } from "../../hooks/useAuth";
import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';

export const QuizHistorySection: React.FC = () => {
    const { user } = useAuth();
    const { data: attempts = [], isLoading: isLoadingAttempts } = useGetQuizAttemptsByUser(user?.azureOid);

    const recentAttempts = attempts.slice(0, 3);

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
                        <div className="bg-base-100 rounded-xl p-4">
                            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                                <FiClock className="text-primary" />
                                Recent Attempts
                            </h3>
                            <div className="space-y-3">
                                {recentAttempts.map(attempt => (
                                    <div key={attempt.id} className="p-3 bg-base-200 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">Quiz #{attempt.id?.slice(-6)}</p>
                                                <p className="text-sm text-base-content/70">
                                                    {new Date(attempt.completedAt!).toLocaleDateString('it-IT', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            {(attempt.badges ?? []).length > 0 && (
                                                <div className="badge badge-warning gap-1">
                                                    🏆 Best Attempt
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Link
                                to="/quiz-review"
                                className="btn btn-primary gap-2"
                            >
                                View All Attempts
                                <FiArrowRight />
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