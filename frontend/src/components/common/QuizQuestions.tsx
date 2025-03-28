import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    QuizDTO,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import MultipleChoiceQuestion from "../question/MultipleChoiceQuestion.tsx";
import TrueFalseQuestion from "../question/TrueFalseQuestion.tsx";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid';
import QuizNavigation from "../quiz/QuizNavigation.tsx";
import {useQuizAttemptLocal} from "../../hooks/quizAttempt/useQuizAttemptLocal.ts";
import {useNavigate} from "react-router-dom";

interface QuizQuestionsProps {
    quiz: QuizDTO;
}

export const QuizQuestions: React.FC<QuizQuestionsProps> = ({quiz}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponses, setUserResponses] = useState<QuestionResponseDTO[]>([]);
    const [isQuizCompleted] = useState(false);
    const {updateQuizAttemptResponses, completeQuizAttempt} = useQuizAttemptLocal();
    const navigate = useNavigate();

    useEffect(() => {
        updateQuizAttemptResponses(userResponses);
    }, [userResponses, updateQuizAttemptResponses]);

    const isTrueFalseQuestion = (question: QuestionDTO): question is TrueFalseQuestionDTO => {
        return question.type === QuestionType.TrueFalse;
    };

    const isMultipleChoiceQuestion = (question: QuestionDTO): question is MultipleChoiceQuestionDTO => {
        return question.type === QuestionType.MultipleChoice;
    };

    const createQuestionResponse = useCallback((
        question: QuestionDTO,
        answer: boolean | number[]
    ): QuestionResponseDTO => {
        if (isTrueFalseQuestion(question)) {
            return {
                type: QuestionType.TrueFalse,
                selectedAnswer: answer as boolean
            } as TrueFalseQuestionResponseDTO;
        }

        if (isMultipleChoiceQuestion(question)) {
            return {
                type: QuestionType.MultipleChoice,
                selectedAnswerIndexes: answer as number[]
            } as MultipleChoiceQuestionResponseDTO;
        }

        throw new Error(`Unsupported question type: ${question.type}`);
    }, []);

    const handleAnswer = useCallback((answer: boolean | number[]) => {
        const currentQuestion = quiz.questions?.[currentQuestionIndex];
        if (!currentQuestion) return;

        const newResponse = createQuestionResponse(currentQuestion, answer);

        setUserResponses(prevResponses => {
            const updatedResponses = [...prevResponses];

            const existingResponseIndex = updatedResponses.findIndex(
                r => r.type === currentQuestion.type
            );

            if (existingResponseIndex !== -1) {
                updatedResponses[existingResponseIndex] = newResponse;
            } else {
                updatedResponses.push(newResponse);
            }

            return updatedResponses;
        });
    }, [currentQuestionIndex, quiz.questions, createQuestionResponse]);

    useMemo(() => {
        updateQuizAttemptResponses(userResponses);
    }, [userResponses, updateQuizAttemptResponses]);

    const calculateScore = useCallback(() => {
        return userResponses.filter(response => {
            const matchingQuestion = quiz.questions?.find(q => q.type === response.type);

            if (!matchingQuestion) return false;

            if (isTrueFalseQuestion(matchingQuestion)) {
                return (response as TrueFalseQuestionResponseDTO).selectedAnswer ===
                    (matchingQuestion as TrueFalseQuestionDTO).correctAnswer;
            }

            if (isMultipleChoiceQuestion(matchingQuestion)) {
                return JSON.stringify((response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes) ===
                    JSON.stringify((matchingQuestion as MultipleChoiceQuestionDTO).correctAnswerIndexes);
            }

            return false;
        }).length;
    }, [userResponses, quiz.questions]);

    const handleCompleteQuiz = useCallback(() => {
        completeQuizAttempt();
        navigate(`/quiz/results`, {
            state: {
                quiz,
                attempt: {
                    responses: userResponses
                }
            }
        });
    }, [completeQuizAttempt, navigate, quiz, userResponses]);

    const getCurrentQuestionResponse = useCallback(() => {
        const currentQuestion = quiz.questions?.[currentQuestionIndex];
        return currentQuestion
            ? userResponses.find(response => response.type === currentQuestion.type)
            : null;
    }, [currentQuestionIndex, userResponses, quiz.questions]);

    if (isQuizCompleted) {
        return (
            <div className="hero grow bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="hero-content text-center">
                    <div className="max-w-md bg-base-100 p-8 rounded-xl shadow-2xl">
                        <h1 className="text-4xl font-bold text-primary mb-4">Quiz Completed!</h1>
                        <p className="text-lg mb-4">
                            You scored {calculateScore()} points out of {quiz.questions?.length || 0}
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
                    <div className="block md:hidden mb-4">
                        <QuizNavigation
                            questions={quiz.questions || []}
                            currentQuestionIndex={currentQuestionIndex}
                            answeredQuestions={
                                quiz.questions?.map((question) =>
                                    userResponses.some(response => response.type === question.type)
                                ) || []
                            }
                            onQuestionChange={(index) => setCurrentQuestionIndex(index)}
                            onCompleteQuiz={handleCompleteQuiz}
                        />
                    </div>

                    <div className="relative w-full max-w-2xl mx-auto">
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

                        <div className="w-full bg-base-100 rounded-full h-2 mb-4 shadow-sm">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / (quiz.questions?.length || 1)) * 100}%`
                                }}
                            ></div>
                        </div>

                        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden
                            transform transition-all duration-500 hover:scale-[1.01]
                            hover:shadow-primary/20 hover:shadow-xl">
                            {isTrueFalseQuestion(currentQuestion!) && (
                                <TrueFalseQuestion
                                    question={currentQuestion}
                                    onAnswer={(isCorrect) => {
                                        const answerValue = isCorrect
                                            ? currentQuestion.correctAnswer
                                            : !currentQuestion.correctAnswer;

                                        handleAnswer(answerValue);
                                    }}
                                    initialAnswer={
                                        (getCurrentQuestionResponse() as TrueFalseQuestionResponseDTO)?.selectedAnswer ?? null
                                    }
                                />
                            )}
                            {isMultipleChoiceQuestion(currentQuestion!) && (
                                <MultipleChoiceQuestion
                                    question={currentQuestion}
                                    onAnswer={(isCorrect) => {
                                        const answerValue = isCorrect
                                            ? currentQuestion.correctAnswerIndexes
                                            : [];

                                        handleAnswer(answerValue);
                                    }}
                                    initialAnswer={
                                        (getCurrentQuestionResponse() as MultipleChoiceQuestionResponseDTO)?.selectedAnswerIndexes ?? null
                                    }
                                    hasBeenAnswered={!!getCurrentQuestionResponse()}
                                />
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <QuizNavigation
                            questions={quiz.questions || []}
                            currentQuestionIndex={currentQuestionIndex}
                            answeredQuestions={
                                quiz.questions?.map((question) =>
                                    userResponses.some(response => response.type === question.type)
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