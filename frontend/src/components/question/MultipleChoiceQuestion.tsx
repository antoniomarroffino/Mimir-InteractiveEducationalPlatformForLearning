import React, {useEffect, useState} from 'react';
import {MultipleChoiceQuestionDTO} from '@dti-isin/backend-api-client';

interface MultipleChoiceQuestionProps {
    question: MultipleChoiceQuestionDTO;
    onAnswer: (isCorrect: boolean | null) => void;
    initialAnswer?: number[] | null;
    hasBeenAnswered?: boolean;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
                                                                           question,
                                                                           onAnswer,
                                                                           initialAnswer = null,
                                                                           hasBeenAnswered = false
                                                                       }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(initialAnswer || []);
    const [isSubmitted, setIsSubmitted] = useState(hasBeenAnswered);

    useEffect(() => {
        setSelectedAnswers(initialAnswer || []);
        setIsSubmitted(hasBeenAnswered);
    }, [question.id, initialAnswer, hasBeenAnswered]);

    const handleAnswerSelection = (index: number) => {
        if (isSubmitted) return;

        const newSelectedAnswers = selectedAnswers.includes(index)
            ? selectedAnswers.filter(i => i !== index)
            : [...selectedAnswers, index];

        setSelectedAnswers(newSelectedAnswers);
    };

    const submitAnswer = () => {
        // Se nessuna risposta selezionata, passa null
        if (selectedAnswers.length === 0) {
            onAnswer(null);
            return;
        }

        setIsSubmitted(true);

        const isCorrect = JSON.stringify(selectedAnswers.sort()) ===
            JSON.stringify(question.correctAnswerIndexes.sort());

        onAnswer(isCorrect);
    };

    return (
        <div className="card-body">
            <h2 className="card-title">{question.questionText}</h2>
            <div className="space-y-2 mt-4">
                {question.choices.map((choice, index) => (
                    <label
                        key={index}
                        className={`
                            flex items-center p-3 border rounded-lg cursor-pointer
                            transition-all duration-300
                            ${isSubmitted
                            ? (selectedAnswers.includes(index)
                                ? (question.correctAnswerIndexes.includes(index)
                                    ? 'bg-success/20 border-success'
                                    : 'bg-error/20 border-error')
                                : (question.correctAnswerIndexes.includes(index)
                                    ? 'bg-success/10 border-success'
                                    : ''))
                            : (selectedAnswers.includes(index)
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-base-200')
                        }
                        `}
                    >
                        <input
                            type="checkbox"
                            checked={selectedAnswers.includes(index)}
                            onChange={() => handleAnswerSelection(index)}
                            disabled={isSubmitted}
                            className="checkbox checkbox-primary mr-3"
                        />
                        <span>{choice}</span>
                    </label>
                ))}
            </div>
            {!isSubmitted && (
                <button
                    onClick={submitAnswer}
                    className="btn btn-primary mt-4 w-full"
                >
                    Confirm Answer
                </button>
            )}
        </div>
    );
};