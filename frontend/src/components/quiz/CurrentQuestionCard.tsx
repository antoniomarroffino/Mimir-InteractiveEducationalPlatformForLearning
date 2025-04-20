import React from 'react';
import {
    QuestionDTO,
    QuestionType,
    MultipleChoiceQuestionDTO,
    TrueFalseQuestionDTO
} from '@dti-isin/backend-api-client';
import { AnimatePresence, motion } from 'framer-motion';
import { TrueFalseQuestion } from '../question/TrueFalseQuestion';
import { MultipleChoiceQuestion } from '../question/MultipleChoiceQuestion';

interface CurrentQuestionCardProps {
    question?: QuestionDTO;
    answer: boolean | number[] | null | undefined;
    onAnswer: (answer: boolean | number[] | null) => void;
}

export const CurrentQuestionCard: React.FC<CurrentQuestionCardProps> = ({ question, answer, onAnswer }) => {
    if (!question) return null;

    const isTrueFalse = question.type === QuestionType.TrueFalse;
    const isMultipleChoice = question.type === QuestionType.MultipleChoice;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl mx-auto"
            >
                {isTrueFalse && (
                    <TrueFalseQuestion
                        question={question as TrueFalseQuestionDTO}
                        initialAnswer={answer as boolean | null}
                        onAnswer={onAnswer}
                    />
                )}
                {isMultipleChoice && (
                    <MultipleChoiceQuestion
                        question={question as MultipleChoiceQuestionDTO}
                        initialAnswer={answer as number[] | null}
                        onAnswer={onAnswer}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
};
