import React, {useState} from 'react';
import {
    QuestionDTO,
    QuestionType,
    QuestionResponseDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import ConfirmModal from './ConfirmModal';

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
                    const trueFalseResponse = response as TrueFalseQuestionResponseDTO;
                    return typeof trueFalseResponse.selectedAnswer === 'boolean';
                }

                case QuestionType.MultipleChoice: {
                    const multipleChoiceResponse = response as MultipleChoiceQuestionResponseDTO;
                    return Array.isArray(multipleChoiceResponse.selectedAnswerIndexes) &&
                        multipleChoiceResponse.selectedAnswerIndexes.length > 0;
                }

                default:
                    return false;
            }
        } catch (error) {
            console.error('Error in verification response:', error);
            return false;
        }
    };

    const answeredQuestions = questions.map((_, index) => isQuestionAnswered(index));

    const unansweredQuestions = questions.filter((_, index) => !isQuestionAnswered(index));

    const handleCompleteQuizClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmComplete = () => {
        onCompleteQuiz();
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-base-100 rounded-xl shadow-xl p-4 space-y-4">
                <h3 className="text-lg font-bold text-primary mb-4">Questions</h3>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {questions.map((question, index) => {
                        const isCurrentQuestion = index === currentQuestionIndex;
                        const isAnswered = isQuestionAnswered(index);

                        return (
                            <button
                                key={question.id}
                                className={`
                                    btn btn-xs 
                                    ${isCurrentQuestion ? 'btn-primary' : 'btn-outline'}
                                    ${isAnswered ? 'btn-success' : ''}
                                `}
                                onClick={() => onQuestionChange(index)}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 text-sm">
                    <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <p className="text-success">
                        {answeredQuestions.filter(Boolean).length} answered
                    </p>
                </div>

                <button
                    onClick={handleCompleteQuizClick}
                    className="btn btn-primary w-full mt-6"
                >
                    Complete Quiz
                    <span className="ml-2 badge badge-success">
                        {answeredQuestions.filter(Boolean).length}/{questions.length}
                    </span>
                </button>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmComplete}
                title="Confirm Quiz Submission"
            >
                {unansweredQuestions.length > 0 ? (
                    <div>
                        <p className="text-error font-bold mb-4">
                            Warning: {unansweredQuestions.length} unanswered question(s)!
                        </p>
                        <p>Unanswered questions:</p>
                        <ul className="list-disc list-inside text-error">
                            {unansweredQuestions.map((question) => (
                                <li key={question.id}>
                                    Question {questions.indexOf(question) + 1}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4">Are you sure you want to submit the quiz?</p>
                    </div>
                ) : (
                    <p>Are you sure you want to submit the quiz?</p>
                )}
            </ConfirmModal>
        </>
    );
};