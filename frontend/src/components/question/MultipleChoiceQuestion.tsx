import React, { useEffect, useState } from 'react';
import { MultipleChoiceQuestionDTO } from '@dti-isin/backend-api-client';
import { motion } from 'framer-motion';

interface MultipleChoiceQuestionProps {
    question: MultipleChoiceQuestionDTO;
    onAnswer: (selectedIndexes: number[] | null) => void;
    initialAnswer: number[] | null;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
                                                                                  question,
                                                                                  onAnswer,
                                                                                  initialAnswer = null
                                                                              }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(initialAnswer || []);

    useEffect(() => {
        setSelectedAnswers(initialAnswer || []);
    }, [question.id, initialAnswer]);

    const handleAnswerSelection = (index: number) => {
        const newSelectedAnswers = selectedAnswers.includes(index)
            ? selectedAnswers.filter(i => i !== index)
            : [...selectedAnswers, index];

        setSelectedAnswers(newSelectedAnswers);
        onAnswer(newSelectedAnswers.length > 0 ? newSelectedAnswers : null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card bg-base-100 shadow-xl"
        >
            <div className="card-body">
                <h2 className="card-title text-2xl text-center text-primary mb-6">
                    {question.questionText}
                </h2>
                <div className="space-y-3 mt-4">
                    {question.choices.map((choice, index) => {
                        const isSelected = selectedAnswers.includes(index);
                        return (
                            <motion.label
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                  flex items-center p-3 border rounded-lg cursor-pointer
                  transition-all duration-300
                  ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-base-200'}
                `}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleAnswerSelection(index)}
                                    className="checkbox checkbox-primary mr-3"
                                />
                                <span className="text-base">{choice}</span>
                            </motion.label>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};
