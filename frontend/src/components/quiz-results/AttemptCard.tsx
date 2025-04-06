// AttemptCard.tsx
import React from 'react';
import {QuizAttemptDTO} from '@dti-isin/backend-api-client';
import {useGetQuizPublicationById} from "../../hooks/quizPublication/useGetQuizPublicationById.ts";

interface AttemptCardProps {
    attempt: QuizAttemptDTO;
    onViewDetails: (attemptId: string) => void;
}

export const AttemptCard: React.FC<AttemptCardProps> = ({attempt, onViewDetails}) => {
    const {
        data: quizPublication,
        isLoading: isLoadingPublication
    } = useGetQuizPublicationById(attempt.quizPublicationId);

    const calculateScore = (attempt: QuizAttemptDTO): number => {
        if (!attempt.responses || !quizPublication?.questions) return 0;

        const correctAnswers = attempt.responses.filter((response) => {
            const question = quizPublication.questions?.find(q => q.id === response.questionId);
            if (!question || !response) return false;
            return true;
        }).length;

        const totalQuestions = quizPublication.questions?.length || 1;
        return Math.round((correctAnswers / totalQuestions) * 100);
    };

    if (isLoadingPublication) {
        return (
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
                <div className="card-body">
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="card-title text-lg">
                            {quizPublication?.quizId || 'Quiz senza titolo'}
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Completato il {new Date(attempt.completedAt!).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className={`badge badge-lg ${
                            calculateScore(attempt) >= 70 ? 'badge-success' :
                                calculateScore(attempt) >= 50 ? 'badge-warning' :
                                    'badge-error'
                        }`}>
                            {calculateScore(attempt)}%
                        </span>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onViewDetails(attempt.id!)}
                        >
                            Dettagli
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};