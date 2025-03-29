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
    }, [initialAnswer]);

    const handleAnswer = (answer: boolean) => {
        // Se clicco lo stesso bottone, rimuovo la selezione
        const newAnswer = selectedAnswer === answer ? null : answer;

        // Aggiorna lo stato locale
        setSelectedAnswer(newAnswer);

        // Passa il valore selezionato, non la sua correttezza
        onAnswer(newAnswer);
    };

    return (
        <div className="card-body">
            <h2 className="card-title">{question.questionText}</h2>
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className={`btn ${selectedAnswer === true ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAnswer(true)}
                >
                    True
                </button>
                <button
                    className={`btn ${selectedAnswer === false ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAnswer(false)}
                >
                    False
                </button>
            </div>
        </div>
    );
};