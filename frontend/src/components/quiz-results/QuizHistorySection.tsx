import React, { useState } from 'react';
import { useGetQuizAttemptsByUser } from "../../hooks/quizAttempt/useGetQuizAttemptsByUser";
import { useAuth } from "../../hooks/useAuth";
import { AttemptCard } from "./AttemptCard";
import { QuizAttemptDTO } from "@dti-isin/backend-api-client";
import {AttemptDetails} from "../publication-stats/AttemptDetails.tsx";
import {useGetQuizPublicationById} from "../../hooks/quizPublication/useGetQuizPublicationById.ts";

export const QuizHistorySection: React.FC = () => {
    const { user } = useAuth();
    const { data: attempts = [], isLoading: isLoadingAttempts } = useGetQuizAttemptsByUser(user?.azureOid);
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptDTO | null>(null);

    const { data: publication, isLoading: isLoadingPublication } = useGetQuizPublicationById(
        selectedAttempt?.quizPublicationId || '',
        { enabled: !!selectedAttempt }
    );

    const handleViewDetails = (attemptId: string) => {
        const attempt = attempts.find(a => a.id === attemptId);
        setSelectedAttempt(attempt || null);
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Lista tentativi */}
            <div className="bg-base-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        Cronologia Quiz
                    </h2>
                    <span className="text-sm text-base-content/70">
                        Totale tentativi: {attempts.length}
                    </span>
                </div>

                {isLoadingAttempts ? (
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
                                isSelected={selectedAttempt?.id === attempt.id}
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

            {/* Dettagli del tentativo selezionato */}
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
                            Errore nel caricamento dei dettagli del quiz
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};