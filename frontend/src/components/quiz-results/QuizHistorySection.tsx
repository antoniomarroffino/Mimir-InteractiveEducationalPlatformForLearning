import React from 'react';
import {useGetQuizAttemptsByUser} from "../../hooks/quizAttempt/useGetQuizAttemptsByUser.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {AttemptCard} from "./AttemptCard.tsx";
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";

export const QuizHistorySection: React.FC = () => {
    const {user} = useAuth();
    const {data: attempts = [] as QuizAttemptDTO[], isLoading} = useGetQuizAttemptsByUser(user?.azureOid);

    const handleViewDetails = (attemptId: string) => {
        // Implementare la logica per visualizzare i dettagli
        console.log('Viewing details for attempt:', attemptId);
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-base-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        Cronologia Quiz
                    </h2>
                    <span className="text-sm text-base-content/70">
                        Totale tentativi: {attempts.length}
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : attempts.length > 0 ? (
                    <div className="grid gap-4">
                        {attempts.map((attempt) => (
                            <AttemptCard
                                key={attempt.id}
                                attempt={attempt}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-base-300 rounded-lg">
                        <p className="text-lg text-base-content/70">
                            Non hai ancora completato nessun quiz
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};