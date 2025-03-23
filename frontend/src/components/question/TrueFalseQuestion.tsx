import React, {useState} from 'react';
import {TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';

interface TrueFalseQuestionProps {
    question: TrueFalseQuestionDTO;
    onAnswer: (isCorrect: boolean) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({question, onAnswer}) => {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

    const handleAnswer = (answer: boolean) => {
        setSelectedAnswer(answer);
        onAnswer(answer === question.correctAnswer);
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{question.questionText}</h2>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        className={`btn ${selectedAnswer === true ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleAnswer(true)}
                        disabled={selectedAnswer !== null}
                    >
                        Vero
                    </button>
                    <button
                        className={`btn ${selectedAnswer === false ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleAnswer(false)}
                        disabled={selectedAnswer !== null}
                    >
                        Falso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrueFalseQuestion;