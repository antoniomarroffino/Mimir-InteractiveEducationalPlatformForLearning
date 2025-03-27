import React, {useCallback, useState} from 'react';
import {MultipleChoiceQuestionDTO, QuestionType, QuizDTO, TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';
import MultipleChoiceQuestion from "../question/MultipleChoiceQuestion.tsx";
import TrueFalseQuestion from "../question/TrueFalseQuestion.tsx";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid';
import QuizNavigation from "../quiz/QuizNavigation.tsx";

interface UserAnswer {
    questionId: string;
    questionType: QuestionType;
    answer: boolean | number[] | null;
    isCorrect: boolean;
    hasBeenAnswered: boolean;
}

interface QuizQuestionsProps {
    quiz: QuizDTO;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({quiz}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    // Trova la risposta esistente per la domanda corrente
    const getCurrentQuestionAnswer = useCallback(() => {
        const currentQuestion = quiz.questions?.[currentQuestionIndex];
        return currentQuestion
            ? userAnswers.find(answer => answer.questionId === currentQuestion.id)
            : null;
    }, [currentQuestionIndex, userAnswers, quiz.questions]);

    // Gestisce la risposta dell'utente in modo più robusto
    const handleAnswer = useCallback((answer: boolean | number[], isCorrect: boolean) => {
        const currentQuestion = quiz.questions?.[currentQuestionIndex];
        if (!currentQuestion) return;

        // Crea una nuova risposta
        const newAnswer: UserAnswer = {
            questionId: currentQuestion.id!,
            questionType: currentQuestion.type,
            answer: answer,
            isCorrect: isCorrect,
            hasBeenAnswered: true
        };

        // Aggiorna lo stato delle risposte
        setUserAnswers(prevAnswers => {
            // Trova l'indice della risposta esistente
            const existingAnswerIndex = prevAnswers.findIndex(
                a => a.questionId === currentQuestion.id
            );

            // Crea una copia dell'array delle risposte precedenti
            const updatedAnswers = [...prevAnswers];

            if (existingAnswerIndex !== -1) {
                // Sostituisci la risposta esistente
                updatedAnswers[existingAnswerIndex] = newAnswer;
            } else {
                // Aggiungi nuova risposta
                updatedAnswers.push(newAnswer);
            }

            return updatedAnswers;
        });
    }, [currentQuestionIndex, quiz.questions]);

    // Calcola il punteggio
    const calculateScore = useCallback(() => {
        return userAnswers.filter(answer => answer.isCorrect).length;
    }, [userAnswers]);

    // Gestisce il completamento del quiz
    const handleCompleteQuiz = () => {
        setIsQuizCompleted(true);
    };

    // Rendering del quiz completato
    if (isQuizCompleted) {
        return (
            <div className="hero grow bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="hero-content text-center">
                    <div className="max-w-md bg-base-100 p-8 rounded-xl shadow-2xl">
                        <h1 className="text-4xl font-bold text-primary mb-4">Quiz Completato!</h1>
                        <p className="text-lg mb-4">
                            Hai totalizzato {calculateScore()} punti su {quiz.questions?.length || 0}
                        </p>
                        <div
                            className="radial-progress text-primary bg-primary/10"
                            style={{["--value" as never]: (calculateScore() / (quiz.questions?.length || 1)) * 100}}
                        >
                            {Math.round((calculateScore() / (quiz.questions?.length || 1)) * 100)}%
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions?.[currentQuestionIndex];

    return (
        <div className="flex grow bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
                    {/* Navigazione del quiz per dispositivi mobili */}
                    <div className="block md:hidden mb-4">
                        <QuizNavigation
                            questions={quiz.questions || []}
                            currentQuestionIndex={currentQuestionIndex}
                            answeredQuestions={
                                quiz.questions?.map((question) =>
                                    userAnswers.some(answer => answer.questionId === question.id)
                                ) || []
                            }
                            onQuestionChange={(index) => setCurrentQuestionIndex(index)}
                            onCompleteQuiz={handleCompleteQuiz}
                        />
                    </div>

                    <div className="relative w-full max-w-2xl mx-auto">
                        {/* Navigazione tra domande */}
                        <div className="absolute inset-y-0 left-0 flex items-center md:-left-12">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="btn btn-circle btn-sm md:btn-md btn-outline btn-primary
                                    disabled:btn-ghost disabled:text-base-300
                                    hover:bg-primary hover:text-primary-content
                                    transition-all duration-300"
                            >
                                <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6"/>
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center md:-right-12">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev =>
                                    Math.min((quiz.questions?.length || 0) - 1, prev + 1)
                                )}
                                disabled={currentQuestionIndex === (quiz.questions?.length || 0) - 1}
                                className="btn btn-circle btn-sm md:btn-md btn-outline btn-primary
                                    disabled:btn-ghost disabled:text-base-300
                                    hover:bg-primary hover:text-primary-content
                                    transition-all duration-300"
                            >
                                <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6"/>
                            </button>
                        </div>

                        {/* Progresso del quiz */}
                        <div className="w-full bg-base-100 rounded-full h-2 mb-4 shadow-sm">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / (quiz.questions?.length || 1)) * 100}%`
                                }}
                            ></div>
                        </div>

                        {/* Rendering dinamico del tipo di domanda */}
                        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden
                            transform transition-all duration-500 hover:scale-[1.01]
                            hover:shadow-primary/20 hover:shadow-xl">
                            {currentQuestion?.type === QuestionType.TrueFalse && (
                                <TrueFalseQuestion
                                    question={currentQuestion as TrueFalseQuestionDTO}
                                    onAnswer={(isCorrect) => {
                                        // Per TrueFalse, passa direttamente il valore booleano
                                        const answerValue = isCorrect
                                            ? (currentQuestion as TrueFalseQuestionDTO).correctAnswer
                                            : !(currentQuestion as TrueFalseQuestionDTO).correctAnswer;

                                        handleAnswer(answerValue, isCorrect);
                                    }}
                                    initialAnswer={
                                        getCurrentQuestionAnswer()?.answer as boolean | null
                                    }
                                />
                            )}
                            {currentQuestion?.type === QuestionType.MultipleChoice && (
                                <MultipleChoiceQuestion
                                    question={currentQuestion as MultipleChoiceQuestionDTO}
                                    onAnswer={(isCorrect) => {
                                        // Per MultipleChoice, passa gli indici delle risposte corrette
                                        const mcQuestion = currentQuestion as MultipleChoiceQuestionDTO;
                                        const answerValue = isCorrect
                                            ? mcQuestion.correctAnswerIndexes
                                            : [];

                                        handleAnswer(answerValue, isCorrect);
                                    }}
                                    initialAnswer={
                                        getCurrentQuestionAnswer()?.answer as number[] | null
                                    }
                                    hasBeenAnswered={
                                        !!getCurrentQuestionAnswer()?.hasBeenAnswered
                                    }
                                />
                            )}
                        </div>
                    </div>

                    {/* Navigazione del quiz per desktop */}
                    <div className="hidden md:block">
                        <QuizNavigation
                            questions={quiz.questions || []}
                            currentQuestionIndex={currentQuestionIndex}
                            answeredQuestions={
                                quiz.questions?.map((question) =>
                                    userAnswers.some(answer => answer.questionId === question.id)
                                ) || []
                            }
                            onQuestionChange={(index) => setCurrentQuestionIndex(index)}
                            onCompleteQuiz={handleCompleteQuiz}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizQuestions;