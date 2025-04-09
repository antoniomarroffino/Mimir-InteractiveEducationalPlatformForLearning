import React, { useState } from 'react';
import { QuizAttemptDTO } from "@dti-isin/backend-api-client";
import { AttemptCard } from "./AttemptCard.tsx";
import SearchAttempts from "./SearchAttempts.tsx";

interface AttemptsListProps {
    attempts: QuizAttemptDTO[];
    isLoading: boolean;
    selectedAttemptId?: string | null;
    onSelectAttempt: (attemptId: string | null) => void;
}

export const AttemptsList: React.FC<AttemptsListProps> = ({
                                                              attempts,
                                                              isLoading,
                                                              selectedAttemptId,
                                                              onSelectAttempt
                                                          }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAttempts = attempts
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .filter(attempt =>
            attempt.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attempt.quizPublicationId?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="flex flex-col h-full bg-base-100 rounded-xl">
            <div className="p-4 border-b">
                <SearchAttempts
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-base-content/70">Loading your quiz history...</p>
                    </div>
                ) : filteredAttempts.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {filteredAttempts.map((attempt) => (
                            <AttemptCard
                                key={attempt.id}
                                attempt={attempt}
                                onViewDetails={onSelectAttempt}
                                isSelected={selectedAttemptId === attempt.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-lg font-medium text-base-content/70">
                            No attempts found
                        </p>
                        <p className="text-sm text-base-content/50 mt-2">
                            Try adjusting your search
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};