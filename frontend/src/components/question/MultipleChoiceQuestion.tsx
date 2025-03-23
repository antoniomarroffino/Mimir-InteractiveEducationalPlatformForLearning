import React, {useState} from 'react';
import {MultipleChoiceQuestionDTO} from '@dti-isin/backend-api-client';

interface MultipleChoiceQuestionProps {
    question: MultipleChoiceQuestionDTO;
    onAnswer: (isCorrect: boolean) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({question, onAnswer}) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

    const handleAnswer = (index: number) => {
        const newSelectedAnswers = selectedAnswers.includes(index)
            ? selectedAnswers.filter(i => i !== index)
            : [...selectedAnswers, index];

        setSelectedAnswers(newSelectedAnswers);

        // Confronta gli indici delle risposte selezionate con quelli delle risposte corrette
        const isCorrect = JSON.stringify(newSelectedAnswers.sort()) ===
            JSON.stringify(question.correctAnswerIndexes.sort());

        onAnswer(isCorrect);
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{question.questionText}</h2>
                <div className="space-y-2 mt-4">
                    {question.choices.map((choice, index) => (
                        <div
                            key={index}
                            className={`btn btn-block ${
                                selectedAnswers.includes(index)
                                    ? 'btn-primary'
                                    : 'btn-outline'
                            }`}
                            onClick={() => handleAnswer(index)}
                        >
                            {choice}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MultipleChoiceQuestion;