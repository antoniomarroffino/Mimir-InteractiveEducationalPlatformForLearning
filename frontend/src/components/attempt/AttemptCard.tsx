import React from 'react';
import {QuizAttemptDTO} from '@dti-isin/backend-api-client';
import {useGetQuizPublicationById} from "../../hooks/quizPublication/useGetQuizPublicationById.ts";
import {AttemptCardDetails} from "./AttemptCardDetails.tsx";

interface AttemptCardProps {
    attempt: QuizAttemptDTO;
    onViewDetails: (attemptId: string | null) => void;
    isSelected?: boolean;
}

export const AttemptCard: React.FC<AttemptCardProps> = ({
                                                            attempt,
                                                            onViewDetails,
                                                            isSelected = false
                                                        }) => {
    const {
        data: quizPublication
    } = useGetQuizPublicationById(attempt.quizPublicationId);

    return (
        <div
            className={`
                relative cursor-pointer
                bg-base-100 transition-all duration-300
                p-4 border-l-4 hover:bg-base-200
                ${isSelected ? 'border-l-primary bg-base-200' : 'border-l-transparent'}
            `}
            onClick={() => onViewDetails(isSelected ? null : attempt.id!)}
        >
            {quizPublication && (
                <AttemptCardDetails attempt={attempt} quizPublication={quizPublication}/>
            )}
        </div>
    );
};