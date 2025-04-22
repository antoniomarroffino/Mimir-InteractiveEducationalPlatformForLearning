import React, {useState} from 'react';
import {
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import ConfirmModal from './ConfirmModal';
import {motion} from 'framer-motion';

interface QuizNavigationProps {
    questions: QuestionDTO[];
    currentQuestionIndex: number;
    onQuestionChange: (index: number) => void;
    onCompleteQuiz: () => void;
    userResponses: QuestionResponseDTO[];
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
                                                                  questions,
                                                                  currentQuestionIndex,
                                                                  onQuestionChange,
                                                                  onCompleteQuiz,
                                                                  userResponses
                                                              }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isQuestionAnswered = (index: number) => {
        const question = questions[index];
        const response = userResponses[index];

        if (!response) return false;

        try {
            switch (question.type) {
                case QuestionType.TrueFalse: {
                    const r = response as TrueFalseQuestionResponseDTO;
                    return typeof r.selectedAnswer === 'boolean';
                }
                case QuestionType.MultipleChoice: {
                    const r = response as MultipleChoiceQuestionResponseDTO;
                    return Array.isArray(r.selectedAnswerIndexes) && r.selectedAnswerIndexes.length > 0;
                }
                default:
                    return false;
            }
        } catch {
            return false;
        }
    };

    const handleConfirmComplete = () => {
        onCompleteQuiz();
        setIsModalOpen(false);
    };

    return (
        <>
            <motion.div
                initial={{opacity: 0, y: 5}}
                animate={{opacity: 1, y: 0}}
                className="bg-base-100 rounded-xl shadow-xl p-4 space-y-4"
            >
                <h3 className="text-lg font-bold text-primary mb-2">Quiz Overview</h3>

                <div className="grid grid-cols-5 gap-2">
                    {questions.map((question, index) => {
                        const isCurrent = index === currentQuestionIndex;
                        const answered = isQuestionAnswered(index);

                        return (
                            <button
                                key={question.id}
                                className={`btn btn-xs transition-all duration-200 ${
                                    isCurrent ? 'btn-primary' : answered ? 'btn-success' : 'btn-outline'
                                }`}
                                onClick={() => onQuestionChange(index)}
                                title={answered ? 'Answered' : 'Unanswered'}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                <div className="text-sm mt-2 space-y-1">
                    <p>
                        Current: <strong>{currentQuestionIndex + 1}</strong> / {questions.length}
                    </p>
                    <p className="text-success">
                        Answered: <strong>{userResponses.filter((_, i) => isQuestionAnswered(i)).length}</strong>
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary w-full mt-4"
                >
                    Submit Quiz
                </button>
            </motion.div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmComplete}
                title="Submit Quiz Confirmation"
            >
                {questions.filter((_, i) => !isQuestionAnswered(i)).length > 0 ? (
                    <div>
                        <p className="text-error font-bold mb-2">
                            There are still unanswered questions!
                        </p>
                        <ul className="list-disc list-inside text-error mb-2">
                            {questions.map((q, i) => !isQuestionAnswered(i) && (
                                <li key={q.id}>Question {i + 1}</li>
                            ))}
                        </ul>
                        <p>Are you sure you want to submit your answers?</p>
                    </div>
                ) : (
                    <p>Are you sure you want to submit your answers?</p>
                )}
            </ConfirmModal>
        </>
    );
};
