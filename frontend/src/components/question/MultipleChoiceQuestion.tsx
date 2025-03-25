import React, {useEffect, useState} from 'react';
import {MultipleChoiceQuestionDTO} from '@dti-isin/backend-api-client';

interface MultipleChoiceQuestionProps {
    question: MultipleChoiceQuestionDTO;
    onAnswer: (isCorrect: boolean) => void;
    initialAnswer?: number[] | null;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
                                                                           question,
                                                                           onAnswer,
                                                                           initialAnswer = null
                                                                       }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(initialAnswer || []);
    useEffect(() => {
        setSelectedAnswers(initialAnswer || []);
    }, [initialAnswer]);

    const handleAnswerSelection = (index: number) => {
        const newSelectedAnswers = selectedAnswers.includes(index)
            ? selectedAnswers.filter(i => i !== index)
            : [...selectedAnswers, index];

        setSelectedAnswers(newSelectedAnswers);
        const isCorrect = JSON.stringify(newSelectedAnswers.sort()) ===
            JSON.stringify(question.correctAnswerIndexes.sort());

        onAnswer(isCorrect);
    };

    return (
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
                        onClick={() => handleAnswerSelection(index)}
                    >
                        {choice}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultipleChoiceQuestion;