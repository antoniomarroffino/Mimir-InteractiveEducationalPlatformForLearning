import React, {useEffect, useState} from 'react';
import {TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';

interface TrueFalseQuestionProps {
    question: TrueFalseQuestionDTO;
    onAnswer: (selectedAnswer: boolean | null) => void;
    initialAnswer?: boolean | null;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
                                                                        question,
                                                                        onAnswer,
                                                                        initialAnswer = null
                                                                    }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(initialAnswer);

    useEffect(() => {
        setSelectedAnswer(initialAnswer);
    }, [question.id, initialAnswer]);

    const handleAnswer = (answer: boolean) => {
        // Se clicco lo stesso bottone, rimuovo la selezione
        const newAnswer = selectedAnswer === answer ? null : answer;

        // Aggiorna lo stato locale
        setSelectedAnswer(newAnswer);

        // Passa il valore selezionato
        onAnswer(newAnswer);
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl text-center text-primary mb-6">
                    {question.questionText}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleAnswer(true)}
                        className={`
                            btn btn-lg 
                            flex flex-col gap-2 
                            ${selectedAnswer === true
                            ? 'btn-success text-white'
                            : 'btn-outline btn-success'}
                            transition-all duration-300
                            hover:scale-105
                        `}
                    >
                        <span>True</span>
                    </button>
                    <button
                        onClick={() => handleAnswer(false)}
                        className={`
                            btn btn-lg 
                            flex flex-col gap-2 
                            ${selectedAnswer === false
                            ? 'btn-error text-white'
                            : 'btn-outline btn-error'}
                            transition-all duration-300
                            hover:scale-105
                        `}
                    >
                        <span>False</span>
                    </button>
                </div>
            </div>
        </div>
    );
};