import React from 'react';
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {AttemptCard} from "../components/quiz-results/AttemptCard.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {useGetQuizAttemptsByUser} from "../hooks/quizAttempt/useGetQuizAttemptsByUser.ts";
import {useGetQuizPublicationById} from "../hooks/quizPublication/useGetQuizPublicationById.ts";
import {AttemptDetails} from "../components/publication-stats/AttemptDetails.tsx";

const QuizReviewPage: React.FC = () => {
    const {user} = useAuth();
    const {data: attempts = [], isLoading: isLoadingAttempts} = useGetQuizAttemptsByUser(user?.azureOid);
    const [selectedAttempt, setSelectedAttempt] = React.useState<QuizAttemptDTO | null | undefined>(null);

    const {data: publication, isLoading: isLoadingPublication} = useGetQuizPublicationById(
        selectedAttempt?.quizPublicationId || '',
        {enabled: !!selectedAttempt}
    );

    const handleViewDetails = (attemptId: string | null) => {
        setSelectedAttempt(attemptId ? attempts.find(a => a.id === attemptId) : null);
    };

    if (!user) return null;

    return (
        <div className="h-[calc(100vh-4rem)]">
            <div className="h-full bg-gradient-to-r from-primary/5 to-secondary/5 p-4 sm:p-6">
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

                <div className="h-[calc(100%-8rem)] flex gap-6">
                    {/* Lista dei tentativi */}
                    <div className="w-96 overflow-y-auto overflow-x-hidden flex-shrink-0">
                        {isLoadingAttempts ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p className="mt-4 text-base-content/70">Loading your quiz history...</p>
                            </div>
                        ) : attempts.length > 0 ? (
                            <div className="flex flex-col gap-4">
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

                    {/* Dettagli del tentativo */}
                    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-base-200 rounded-xl">
                        {selectedAttempt ? (
                            isLoadingPublication ? (
                                <div className="flex justify-center items-center h-full">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : publication ? (
                                <AttemptDetails
                                    attempt={selectedAttempt}
                                    publication={publication}
                                    showBadgeAssignment={false}
                                />
                            ) : (
                                <div className="flex justify-center items-center h-full text-error">
                                    Error loading quiz details
                                </div>
                            )
                        ) : (
                            <div className="flex items-center justify-center h-full text-base-content/70">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">👆</div>
                                    <p className="text-lg font-medium">
                                        Select an attempt to view details
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizReviewPage;