import React from 'react';
import {QuizAttemptDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {QuizReview} from "../quiz-results/QuizReview.tsx";

interface AttemptDetailsProps {
    attempt: QuizAttemptDTO;
    publication: QuizPublicationDTO;
    onClose?: () => void;
}

export const AttemptDetails: React.FC<AttemptDetailsProps> = ({
                                                                  attempt,
                                                                  publication,
                                                                  onClose
                                                              }) => {
    return (
        <div className="p-4">
            <QuizReview
                attempt={attempt}
                publication={publication}
                onClose={onClose}
            />
        </div>
    );
};