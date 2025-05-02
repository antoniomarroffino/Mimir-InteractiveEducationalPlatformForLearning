import React, {useEffect, useState} from 'react';
import {TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';
import {motion} from 'framer-motion';

interface TrueFalseQuestionProps {
    question: TrueFalseQuestionDTO;
    onAnswer: (selectedAnswer: boolean | null) => void;
    initialAnswer: boolean | null;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
                                                                        question,
                                                                        onAnswer,
                                                                        initialAnswer
                                                                    }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(initialAnswer);

    useEffect(() => {
        setSelectedAnswer(initialAnswer);
    }, [question.id, initialAnswer]);

    const handleAnswer = (answer: boolean) => {
        const newAnswer = selectedAnswer === answer ? null : answer;
        setSelectedAnswer(newAnswer);
        onAnswer(newAnswer);
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="card bg-base-100 shadow-xl"
        >
            <div className="card-body">
                <h2 className="card-title text-2xl text-center text-primary mb-6">
                    {question.questionText}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleAnswer(true)}
                        className={`
              btn btn-lg flex flex-col gap-2 
              ${selectedAnswer === true
                            ? 'btn-success text-white scale-105'
                            : 'btn-outline btn-success'}
              transition-transform duration-300 hover:scale-105
            `}
                    >
                        True
                    </button>
                    <button
                        onClick={() => handleAnswer(false)}
                        className={`
              btn btn-lg flex flex-col gap-2 
              ${selectedAnswer === false
                            ? 'btn-error text-white scale-105'
                            : 'btn-outline btn-error'}
              transition-transform duration-300 hover:scale-105
            `}
                    >
                        False
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
