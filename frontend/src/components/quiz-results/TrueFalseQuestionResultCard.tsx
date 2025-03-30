import React from 'react';
import {
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import { BaseQuestionResultCard } from './BaseQuestionResultCard';

interface TrueFalseQuestionResultCardProps {
    question: TrueFalseQuestionDTO;
    response: TrueFalseQuestionResponseDTO;
    index: number;
}

export const TrueFalseQuestionResultCard: React.FC<TrueFalseQuestionResultCardProps> = ({
                                                                                            question,
                                                                                            response,
                                                                                            index
                                                                                        }) => {
    // Formatta la risposta dell'utente
    const userAnswer = response.selectedAnswer !== null
        ? (response.selectedAnswer ? 'True' : 'False')
        : 'No answer';

    // Formatta la risposta corretta
    const correctAnswer = question.correctAnswer ? 'True' : 'False';

    // Verifica se la risposta è corretta
    const isCorrect = response.selectedAnswer === question.correctAnswer;

    return (
        <BaseQuestionResultCard
            question={question}
            response={response}
            index={index}
            userAnswer={userAnswer}
            correctAnswer={correctAnswer}
            isCorrect={isCorrect}
        />
    );
};