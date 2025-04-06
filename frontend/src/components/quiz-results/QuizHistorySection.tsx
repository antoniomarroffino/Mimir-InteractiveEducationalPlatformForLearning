import React, {useState} from 'react';
import {useGetQuizAttemptsByUser} from "../../hooks/quizAttempt/useGetQuizAttemptsByUser";
import {useAuth} from "../../hooks/useAuth";
import {AttemptCard} from "./AttemptCard";
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {AttemptDetails} from "../publication-stats/AttemptDetails.tsx";
import {useGetQuizPublicationById} from "../../hooks/quizPublication/useGetQuizPublicationById.ts";

export const QuizHistorySection: React.FC = () => {
    const {user} = useAuth();
    const {data: attempts = [], isLoading: isLoadingAttempts} = useGetQuizAttemptsByUser(user?.azureOid);
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptDTO | null | undefined>(null);

    const {data: publication, isLoading: isLoadingPublication} = useGetQuizPublicationById(
        selectedAttempt?.quizPublicationId || '',
        {enabled: !!selectedAttempt}
    );

    const handleViewDetails = (attemptId: string | null) => {
        setSelectedAttempt(attemptId ? attempts.find(a => a.id === attemptId) : null);
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Your Quiz Journey
                        </h2>
                        <p className="text-base-content/70 mt-2">
                            Track your progress and achievements
                        </p>
                    </div>
                    <div className="stats bg-base-100 shadow">
                        <div className="stat p-4">
                            <div className="stat-title">Total Attempts</div>
                            <div className="stat-value text-primary">{attempts.length}</div>
                        </div>
                    </div>
                </div>

                {isLoadingAttempts ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-base-content/70">Loading your quiz history...</p>
                    </div>
                ) : attempts.length > 0 ? (
                    <div className="grid gap-6">
                        {attempts.map((attempt) => (
                            <AttemptCard
                                key={attempt.id}
                                attempt={attempt}
                                onViewDetails={handleViewDetails}
                                isSelected={selectedAttempt?.id === attempt.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-base-100 rounded-xl">
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-xl font-medium text-base-content/70">
                            Start your learning journey
                        </p>
                        <p className="text-base-content/50 mt-2">
                            Complete your first quiz to see your progress here
                        </p>
                    </div>
                )}
            </div>

            {selectedAttempt && (
                <div className="bg-base-200 rounded-xl p-6">
                    {isLoadingPublication ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : publication ? (
                        <AttemptDetails
                            attempt={selectedAttempt}
                            publication={publication}
                        />
                    ) : (
                        <div className="text-center py-4 text-error">
                            Error loading quiz details
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};