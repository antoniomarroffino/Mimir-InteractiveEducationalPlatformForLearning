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
                    // Considera risposta solo se è un booleano definito
                    return typeof trueFalseResponse.selectedAnswer === 'boolean';
                }

                case QuestionType.MultipleChoice: {
                    const multipleChoiceResponse = response as MultipleChoiceQuestionResponseDTO;
                    // Considera risposta solo se ci sono indici selezionati
                    return Array.isArray(multipleChoiceResponse.selectedAnswerIndexes) &&
                        multipleChoiceResponse.selectedAnswerIndexes.length > 0;
                }

                default:
                    return false;
            }
        } catch (error) {
            console.error('Errore nel verificare la risposta:', error);
            return false;
        }
    };

    // Calcola le risposte date
    const answeredQuestions = questions.map((_, index) => isQuestionAnswered(index));

    // Trova le domande non risposte
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
                <h3 className="text-lg font-bold text-primary mb-4">Domande</h3>

                {/* Griglia delle domande */}
                <div className="grid grid-cols-5 gap-2">
                    {questions.map((question, index) => {
                        const isCurrentQuestion = index === currentQuestionIndex;
                        const isAnswered = isQuestionAnswered(index);

                        const buttonClasses = `
                            btn btn-xs 
                            ${isCurrentQuestion ? 'btn-primary' : 'btn-outline'}
                            ${isAnswered ? 'btn-success' : ''}
                        `;

                        return (
                            <button
                                key={question.id}
                                className={buttonClasses}
                                onClick={() => onQuestionChange(index)}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Informazioni sul progresso */}
                <div className="mt-4 text-sm text-base-content">
                    <p>Domanda {currentQuestionIndex + 1} di {questions.length}</p>
                </div>

                {/* Pulsante per completare il quiz */}
                <div className="mt-6">
                    <button
                        onClick={handleCompleteQuizClick}
                        className="btn btn-primary btn-block
                            transition-all duration-300"
                    >
                        Termina Quiz
                        <span className="ml-2 badge badge-success">
                            {answeredQuestions.filter(Boolean).length}/{questions.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Modal di conferma */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmComplete}
                title="Conferma Consegna Quiz"
            >
                {unansweredQuestions.length > 0 ? (
                    <div>
                        <p className="text-error font-bold mb-4">
                            Attenzione: {unansweredQuestions.length} domanda/e non ancora risposte!
                        </p>
                        <p>Domande non risposte:</p>
                        <ul className="list-disc list-inside text-error">
                            {unansweredQuestions.map((question) => (
                                <li key={question.id}>
                                    Domanda {questions.indexOf(question) + 1}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4">Sei sicuro di voler consegnare il quiz?</p>
                    </div>
                ) : (
                    <p>Sei sicuro di voler consegnare il quiz?</p>
                )}
            </ConfirmModal>
        </>
    );
};