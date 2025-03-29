import React, {useCallback, useEffect, useState} from 'react';
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
import {MultipleChoiceQuestion} from "../question/MultipleChoiceQuestion.tsx";
import {TrueFalseQuestion} from "../question/TrueFalseQuestion.tsx";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid';
import {QuizNavigation} from "../quiz/QuizNavigation.tsx";
import {useQuizAttemptLocal} from "../../hooks/quizAttempt/useQuizAttemptLocal.ts";

interface QuizQuestionsProps {
    quiz: QuizDTO;
}

export const QuizQuestions: React.FC<QuizQuestionsProps> = ({quiz}) => {
    const {currentAttempt, updateQuizAttemptResponses, completeQuizAttempt} = useQuizAttemptLocal();

    // Usa le risposte dal tentativo corrente
    const [userResponses, setUserResponses] = useState<QuestionResponseDTO[]>(
        currentAttempt?.responses || new Array(quiz.questions?.length || 0).fill(null)
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Aggiorna le risposte nel provider quando cambiano
    useEffect(() => {
        updateQuizAttemptResponses(userResponses);
    }, [userResponses, updateQuizAttemptResponses]);

    const isTrueFalseQuestion = (question: QuestionDTO): question is TrueFalseQuestionDTO => {
        return question.type === QuestionType.TrueFalse;
    };

    const isMultipleChoiceQuestion = (question: QuestionDTO): question is MultipleChoiceQuestionDTO => {
        return question.type === QuestionType.MultipleChoice;
    };

    const handleAnswer = useCallback((answer: boolean | number[] | null) => {
        const currentQuestion = quiz.questions?.[currentQuestionIndex];
        if (!currentQuestion) return;

        setUserResponses(prevResponses => {
            const updatedResponses = [...prevResponses];

            if (currentQuestion.type === QuestionType.TrueFalse && (typeof answer === 'boolean' || answer === null)) {
                updatedResponses[currentQuestionIndex] = {
                    type: QuestionType.TrueFalse,
                    selectedAnswer: answer
                } as TrueFalseQuestionResponseDTO;
            } else if (currentQuestion.type === QuestionType.MultipleChoice && Array.isArray(answer)) {
                updatedResponses[currentQuestionIndex] = {
                    type: QuestionType.MultipleChoice,
                    selectedAnswerIndexes: answer
                } as MultipleChoiceQuestionResponseDTO;
            }

            return updatedResponses;
        });
    }, [currentQuestionIndex, quiz.questions]);

    const getCurrentQuestionResponse = useCallback(() => {
        // Recupera la risposta usando l'indice corrente
        return userResponses[currentQuestionIndex] || null;
    }, [currentQuestionIndex, userResponses]);

    const handleCompleteQuiz = useCallback(async () => {
        try {
            await completeQuizAttempt();
        } catch (error) {
            console.error('Errore durante il completamento del quiz:', error);
        }
    }, [completeQuizAttempt]);

    const currentQuestion = quiz.questions?.[currentQuestionIndex];
    return (
        <div className="flex grow bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
                    <div className="relative w-full max-w-2xl mx-auto">
                        {/* Navigazione tra domande */}
                        <div className="absolute inset-y-0 left-0 flex items-center md:-left-12">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="btn btn-circle btn-sm md:btn-md btn-outline btn-primary"
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
                                className="btn btn-circle btn-sm md:btn-md btn-outline btn-primary"
                            >
                                <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6"/>
                            </button>
                        </div>

                        {/* Rendering dinamico del tipo di domanda */}
                        {isTrueFalseQuestion(currentQuestion!) && (
                            <TrueFalseQuestion
                                question={currentQuestion}
                                onAnswer={(selectedAnswer) => {
                                    handleAnswer(selectedAnswer);
                                }}
                                initialAnswer={
                                    (getCurrentQuestionResponse() as TrueFalseQuestionResponseDTO)?.selectedAnswer ?? null
                                }
                            />
                        )}
                        {isMultipleChoiceQuestion(currentQuestion!) && (
                            <MultipleChoiceQuestion
                                question={currentQuestion}
                                onAnswer={(selectedIndexes) => {
                                    handleAnswer(selectedIndexes);
                                }}
                                initialAnswer={
                                    (getCurrentQuestionResponse() as MultipleChoiceQuestionResponseDTO)?.selectedAnswerIndexes ?? null
                                }
                                hasBeenAnswered={!!getCurrentQuestionResponse()}
                            />
                        )}
                    </div>

                    {/* Navigazione del quiz */}
                    <div className="hidden md:block">
                        <QuizNavigation
                            questions={quiz.questions || []}
                            currentQuestionIndex={currentQuestionIndex}
                            onQuestionChange={(index) => setCurrentQuestionIndex(index)}
                            onCompleteQuiz={handleCompleteQuiz}
                            userResponses={userResponses}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};