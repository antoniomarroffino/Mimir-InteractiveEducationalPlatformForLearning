import React, {useEffect, useState} from 'react';
import {TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';

interface TrueFalseQuestionProps {
    question: TrueFalseQuestionDTO;
    onAnswer: (isCorrect: boolean | null) => void;
    initialAnswer?: boolean | null;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
                                                                 question,
                                                                 onAnswer,
                                                                 initialAnswer = null
                                                             }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(initialAnswer);

    useEffect(() => {
        setSelectedAnswer(initialAnswer);
    }, [initialAnswer]);

    const handleAnswer = (answer: boolean | null) => {
        // Se clicco lo stesso bottone, rimuovo la selezione
        const newAnswer = selectedAnswer === answer ? null : answer;
        setSelectedAnswer(newAnswer);

        // Se newAnswer è null, passo null come isCorrect
        const isCorrect = newAnswer === null ? null : newAnswer === question.correctAnswer;
        onAnswer(isCorrect);
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

export default TrueFalseQuestion;