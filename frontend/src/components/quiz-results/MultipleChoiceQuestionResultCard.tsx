import React from 'react';
import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import { BaseQuestionResultCard } from './BaseQuestionResultCard';

interface MultipleChoiceQuestionResultCardProps {
    question: MultipleChoiceQuestionDTO;
    response: MultipleChoiceQuestionResponseDTO;
    index: number;
}

export const MultipleChoiceQuestionResultCard: React.FC<MultipleChoiceQuestionResultCardProps> = ({
                                                                                                      question,
                                                                                                      response,
                                                                                                      index
                                                                                                  }) => {
    // Formatta la risposta dell'utente
    const userAnswer = !response.selectedAnswerIndexes || response.selectedAnswerIndexes.length === 0
        ? 'No answer'
        : response.selectedAnswerIndexes
            .map(idx => question.choices[idx])
            .join(', ');

    // Formatta la risposta corretta
    const correctAnswer = question.correctAnswerIndexes
        .map(idx => question.choices[idx])
        .join(', ');

    // Verifica se la risposta è corretta
    const isCorrect = JSON.stringify(response.selectedAnswerIndexes?.sort() || []) ===
        JSON.stringify(question.correctAnswerIndexes.sort());

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