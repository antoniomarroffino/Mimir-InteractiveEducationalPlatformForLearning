import React, {useCallback, useEffect, useState} from 'react';
import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    QuizPublicationDTO,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import {MultipleChoiceQuestion} from "../question/MultipleChoiceQuestion.tsx";
import {TrueFalseQuestion} from "../question/TrueFalseQuestion.tsx";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid';
import {QuizNavigation} from "../quiz/QuizNavigation.tsx";
import {useQuizAttemptLocal} from "../../hooks/quizAttempt/useQuizAttemptLocal.ts";

interface QuizQuestionsProps {
    publication: QuizPublicationDTO;
}

export const QuizQuestions: React.FC<QuizQuestionsProps> = ({publication}) => {
    const {currentAttempt, updateQuizAttemptResponses, completeQuizAttempt} = useQuizAttemptLocal();

    const [userResponses, setUserResponses] = useState<QuestionResponseDTO[]>(
        currentAttempt?.responses || new Array(publication.questions?.length || 0).fill(null)
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
        const currentQuestion = publication.questions?.[currentQuestionIndex];
        if (!currentQuestion) return;

        setUserResponses(prevResponses => {
            const updatedResponses = [...prevResponses];

            switch (currentQuestion.type) {
                case QuestionType.TrueFalse:
                    if (typeof answer === 'boolean' || answer === null) {
                        updatedResponses[currentQuestionIndex] = {
                            responseType: QuestionType.TrueFalse,
                            selectedAnswer: answer
                        } as TrueFalseQuestionResponseDTO;
                    }
                    break;

                case QuestionType.MultipleChoice:
                    if (Array.isArray(answer) || answer === null) {
                        updatedResponses[currentQuestionIndex] = {
                            responseType: QuestionType.MultipleChoice,
                            selectedAnswerIndexes: answer || []
                        } as MultipleChoiceQuestionResponseDTO;
                    }
                    break;
            }

            return updatedResponses;
        });
    }, [currentQuestionIndex, publication.questions]);

    const getCurrentQuestionResponse = useCallback(() => {
        const response = userResponses[currentQuestionIndex];

        if (!response) return null;

        switch (response.responseType) {
            case QuestionType.TrueFalse:
                return (response as TrueFalseQuestionResponseDTO).selectedAnswer;

            case QuestionType.MultipleChoice:
                return (response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes;

            default:
                return null;
        }
    }, [currentQuestionIndex, userResponses]);

    const handleCompleteQuiz = useCallback(async () => {
        try {
            await completeQuizAttempt();
        } catch (error) {
            console.error('Errore durante il completamento del quiz:', error);
        }
    }, [completeQuizAttempt]);

    const currentQuestion = publication.questions?.[currentQuestionIndex];
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
                                    Math.min((publication.questions?.length || 0) - 1, prev + 1)
                                )}
                                disabled={currentQuestionIndex === (publication.questions?.length || 0) - 1}
                                className="btn btn-circle btn-sm md:btn-md btn-outline btn-primary"
                            >
                                <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6"/>
                            </button>
                        </div>

                        {/* Rendering dinamico del tipo di domanda */}
                        {isTrueFalseQuestion(currentQuestion!) && (
                            <TrueFalseQuestion
                                key={currentQuestion.id}
                                question={currentQuestion}
                                onAnswer={(selectedAnswer) => {
                                    handleAnswer(selectedAnswer);
                                }}
                                initialAnswer={
                                    getCurrentQuestionResponse() as boolean | null
                                }
                            />
                        )}
                        {isMultipleChoiceQuestion(currentQuestion!) && (
                            <MultipleChoiceQuestion
                                key={currentQuestion.id}
                                question={currentQuestion}
                                onAnswer={(selectedIndexes) => {
                                    handleAnswer(selectedIndexes);
                                }}
                                initialAnswer={
                                    getCurrentQuestionResponse() as number[] | null
                                }
                            />
                        )}
                    </div>

                    {/* Navigazione del quiz */}
                    <div className="hidden md:block">
                        <QuizNavigation
                            questions={publication.questions || []}
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