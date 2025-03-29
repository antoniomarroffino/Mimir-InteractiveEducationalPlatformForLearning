import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    QuestionType,
    QuestionDTO,
    QuestionResponseDTO,
    TrueFalseQuestionDTO,
    MultipleChoiceQuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import {useQuizRetrieve} from "../hooks/useQuizRetrieve.ts";
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal.ts";

const QuizResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quiz } = useQuizRetrieve();
    const { resetQuizAttempt } = useQuizAttemptLocal();
    const { attempt } = location.state || {};

    // Gestisci il caso in cui non ci siano dati
    React.useEffect(() => {
        if (!quiz || !attempt) {
            navigate('/');
        }
    }, [quiz, attempt, navigate]);

    const formatUserResponse = (question: QuestionDTO, response: QuestionResponseDTO) => {
        if (question.type === QuestionType.TrueFalse) {
            const trueFalseResponse = response as TrueFalseQuestionResponseDTO;
            return trueFalseResponse.selectedAnswer !== null
                ? (trueFalseResponse.selectedAnswer ? 'Vero' : 'Falso')
                : 'Nessuna risposta';
        }

        if (question.type === QuestionType.MultipleChoice) {
            const multipleChoiceQuestion = question as MultipleChoiceQuestionDTO;
            const multipleChoiceResponse = response as MultipleChoiceQuestionResponseDTO;

            // Aggiungi un controllo di nullità/undefined
            if (!multipleChoiceResponse.selectedAnswerIndexes || multipleChoiceResponse.selectedAnswerIndexes.length === 0) {
                return 'Nessuna risposta';
            }

            return multipleChoiceResponse.selectedAnswerIndexes
                .map(index => multipleChoiceQuestion.choices[index])
                .join(', ');
        }

        return 'Tipo di domanda non supportato';
    };

    const isResponseCorrect = (question: QuestionDTO, response: QuestionResponseDTO): boolean => {
        if (question.type === QuestionType.TrueFalse) {
            const trueFalseQuestion = question as TrueFalseQuestionDTO;
            const trueFalseResponse = response as TrueFalseQuestionResponseDTO;
            return trueFalseResponse.selectedAnswer === trueFalseQuestion.correctAnswer;
        }

        if (question.type === QuestionType.MultipleChoice) {
            const multipleChoiceQuestion = question as MultipleChoiceQuestionDTO;
            const multipleChoiceResponse = response as MultipleChoiceQuestionResponseDTO;

            // Aggiungi un controllo di nullità/undefined
            const responseIndexes = multipleChoiceResponse.selectedAnswerIndexes || [];
            const correctIndexes = multipleChoiceQuestion.correctAnswerIndexes || [];

            return JSON.stringify(responseIndexes) === JSON.stringify(correctIndexes);
        }

        return false;
    };

    const formatCorrectAnswer = (question: QuestionDTO) => {
        if (question.type === QuestionType.TrueFalse) {
            const trueFalseQuestion = question as TrueFalseQuestionDTO;
            return trueFalseQuestion.correctAnswer ? 'Vero' : 'Falso';
        }

        if (question.type === QuestionType.MultipleChoice) {
            const multipleChoiceQuestion = question as MultipleChoiceQuestionDTO;
            return multipleChoiceQuestion.correctAnswerIndexes
                .map(index => multipleChoiceQuestion.choices[index])
                .join(', ');
        }

        return 'Tipo di domanda non supportato';
    };

    const calculateScore = () => {
        return attempt.responses.filter((response: QuestionResponseDTO, index: number) => {
            const question = quiz?.questions?.[index];
            return question ? isResponseCorrect(question, response) : false;
        }).length;
    };

    const getScoreEmoji = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage === 100) return '🏆';
        if (percentage >= 90) return '🌟';
        if (percentage >= 70) return '👍';
        if (percentage >= 50) return '🤔';
        return '😕';
    };

    // Gestisci il caso di caricamento
    if (!quiz || !attempt) {
        return <div>Caricamento...</div>;
    }

    const totalQuestions = quiz.questions?.length || 0;
    const score = calculateScore();

    const handleRestart = () => {
        resetQuizAttempt();
        navigate('/'); // Torna alla pagina principale o dove preferisci
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
            <div className="container mx-auto px-4">
                <div className="card bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
                    <div className="card-body space-y-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-primary mb-4">
                                Risultati del Quiz
                            </h2>
                            <div className="text-6xl mb-4">
                                {getScoreEmoji(score, totalQuestions)}
                            </div>
                        </div>

                        <div className="stats shadow-lg w-full">
                            <div className="stat">
                                <div className="stat-title">Punteggio</div>
                                <div className="stat-value text-primary">
                                    {score} / {totalQuestions}
                                </div>
                                <div className="stat-desc">
                                    {Math.round((score / (totalQuestions || 1)) * 100)}%
                                    risposte corrette
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {quiz.questions?.map((question, index) => {
                                const response = attempt.responses[index];
                                const isCorrect = isResponseCorrect(question, response);

                                return (
                                    <div
                                        key={index}
                                        className={`
                                            card 
                                            ${isCorrect
                                            ? 'bg-success/10 border-l-4 border-success'
                                            : 'bg-error/10 border-l-4 border-error'
                                        } 
                                            shadow-md transition-all hover:shadow-lg
                                        `}
                                    >
                                        <div className="card-body">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="card-title text-xl flex-grow">
                                                    Domanda {index + 1}: {question.questionText}
                                                </h3>
                                                {isCorrect
                                                    ? <CheckCircleIcon className="h-8 w-8 text-success" />
                                                    : <XCircleIcon className="h-8 w-8 text-error" />
                                                }
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="font-bold mb-2 text-primary">
                                                        La tua risposta:
                                                    </div>
                                                    <p className={`
                                                        p-2 rounded 
                                                        ${isCorrect
                                                        ? 'bg-success/20 text-success-content'
                                                        : 'bg-error/20 text-error-content'
                                                    }
                                                    `}>
                                                        {formatUserResponse(question, response)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <div className="font-bold mb-2 text-primary">
                                                        Risposta corretta:
                                                    </div>
                                                    <p className="p-2 bg-info/20 text-info-content rounded">
                                                        {formatCorrectAnswer(question)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pulsante per ricominciare */}
                        <div className="text-center mt-8">
                            <button
                                onClick={handleRestart}
                                className="btn btn-primary"
                            >
                                Torna alla Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;