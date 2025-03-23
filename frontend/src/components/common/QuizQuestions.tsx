import React, {useState} from 'react';
import {MultipleChoiceQuestionDTO, QuestionType, QuizDTO, TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';
import MultipleChoiceQuestion from "../question/MultipleChoiceQuestion.tsx";
import TrueFalseQuestion from "../question/TrueFalseQuestion.tsx";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid';
import QuizNavigation from "../quiz/QuizNavigation.tsx";

interface QuizQuestionsProps {
    quiz: QuizDTO;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({quiz}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
        new Array(quiz.questions?.length || 0).fill(false)
    );

    const handleAnswer = (isCorrect: boolean) => {
        const newAnsweredQuestions = [...answeredQuestions];
        newAnsweredQuestions[currentQuestionIndex] = true;
        setAnsweredQuestions(newAnsweredQuestions);

        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        moveToNextQuestion();
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < (quiz.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsQuizCompleted(true);
        }
    };

    const moveToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleCompleteQuiz = () => {
        setIsQuizCompleted(true);

    };

    if (isQuizCompleted) {
        return (
            <div className="hero grow bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="hero-content text-center">
                    <div className="max-w-md bg-base-100 p-8 rounded-xl shadow-2xl">
                        <h1 className="text-4xl font-bold text-primary mb-4">Quiz Completato!</h1>
                        <p className="text-lg mb-4">
                            Hai totalizzato {score} punti su {quiz.questions?.length || 0}
                        </p>
                        <div
                            className="radial-progress text-primary bg-primary/10"
                            style={{["--value" as never]: (score / (quiz.questions?.length || 1)) * 100}}
                        >
                            {Math.round((score / (quiz.questions?.length || 1)) * 100)}%
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
                    {/* Contenitore principale delle domande */}
                    <div className="relative w-full max-w-2xl mx-auto">
                        {/* Navigazione tra domande */}
                        <div className="absolute inset-y-0 left-0 flex items-center md:-left-12">
                            <button
                                onClick={moveToPreviousQuestion}
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
                                onClick={moveToNextQuestion}
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
                                    onAnswer={handleAnswer}
                                />
                            )}
                            {currentQuestion?.type === QuestionType.MultipleChoice && (
                                <MultipleChoiceQuestion
                                    question={currentQuestion as MultipleChoiceQuestionDTO}
                                    onAnswer={handleAnswer}
                                />
                            )}
                        </div>
                    </div>

                    {/* Navigazione del quiz */}
                    <div className="hidden md:block">
                        <QuizNavigation
                            questions={quiz.questions || []}
                            currentQuestionIndex={currentQuestionIndex}
                            answeredQuestions={answeredQuestions}
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