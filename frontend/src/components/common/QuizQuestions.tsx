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
import {QuizNavigation} from "../quiz/QuizNavigation.tsx";
import {useQuizAttemptLocal} from "../../hooks/quizAttempt/useQuizAttemptLocal.ts";
import {useNavigate} from "react-router-dom";
import {MobileNavigation} from "./MobileNavigation.tsx";
import {QuestionResponseFactory} from "../question/QuestionResponseFactory.tsx";
import {ClockIcon} from "@heroicons/react/24/outline";
import {useQuizAttemptAutosave} from "../../hooks/quizAttempt/useQuizAttemptAutosave";
import {AnimatePresence, motion} from 'framer-motion';
import {QuestionNavigationArrows} from "../quiz/QuestionNavigationArrows.tsx";

interface QuizQuestionsProps {
    publication: QuizPublicationDTO;
    timeLimit?: number;
}

export const QuizQuestions: React.FC<QuizQuestionsProps> = ({publication, timeLimit}) => {
    const {currentAttempt, updateQuizAttemptResponses, completeQuizAttempt} = useQuizAttemptLocal();
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(
        timeLimit ? timeLimit * 60 : null
    );
    const [userResponses, setUserResponses] = useState<QuestionResponseDTO[]>(
        currentAttempt?.responses || new Array(publication.questions?.length || 0).fill(null)
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const navigate = useNavigate();

    useQuizAttemptAutosave(15000);

    useEffect(() => {
        const timer = setInterval(() => {
            setUserResponses(prev => {
                const updated = [...prev];
                if (updated[currentQuestionIndex]) {
                    updated[currentQuestionIndex] = {
                        ...updated[currentQuestionIndex],
                        timeSpent: (updated[currentQuestionIndex].timeSpent || 0) + 1
                    };
                }
                return updated;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (!timeRemaining) return;
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (!prev || prev <= 0) {
                    clearInterval(timer);
                    handleCompleteQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeRemaining]);

    useEffect(() => {
        updateQuizAttemptResponses(userResponses);
    }, [userResponses, updateQuizAttemptResponses]);

    const formatTimeRemaining = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isTrueFalseQuestion = (q: QuestionDTO): q is TrueFalseQuestionDTO => q.type === QuestionType.TrueFalse;
    const isMultipleChoiceQuestion = (q: QuestionDTO): q is MultipleChoiceQuestionDTO => q.type === QuestionType.MultipleChoice;

    const handleAnswer = useCallback((answer: boolean | number[] | null) => {
        const currentQuestion = publication.questions?.[currentQuestionIndex];
        if (!currentQuestion) return;

        setUserResponses(prev => {
            const updated = [...prev];
            const timeSpent = updated[currentQuestionIndex]?.timeSpent || 0;

            if (isTrueFalseQuestion(currentQuestion)) {
                const tfAnswer = typeof answer === 'boolean' ? answer : undefined;
                updated[currentQuestionIndex] = {
                    ...QuestionResponseFactory.createResponse(
                        QuestionType.TrueFalse,
                        currentQuestion.id!,
                        tfAnswer
                    ),
                    timeSpent
                };
            } else if (isMultipleChoiceQuestion(currentQuestion)) {
                const mcAnswer = Array.isArray(answer) ? answer : [];
                updated[currentQuestionIndex] = {
                    ...QuestionResponseFactory.createResponse(
                        QuestionType.MultipleChoice,
                        currentQuestion.id!,
                        mcAnswer
                    ),
                    timeSpent
                };
            }

            return updated;
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
            const completedAttempt = await completeQuizAttempt();
            navigate(`/results/${completedAttempt.id!}`, {
                state: {attempt: completedAttempt, quizPublication: publication}
            });
        } catch (error) {
            console.error('Error during completing quiz:', error);
        }
    }, [completeQuizAttempt, navigate, publication]);

    const currentQuestion = publication.questions?.[currentQuestionIndex];

    return (
        <div className="relative h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
            <div className="container mx-auto h-full px-4 py-6 flex gap-6 items-start">
                {/* Left - Question Area */}
                <div className="flex-1 h-full overflow-y-auto pr-2">
                    {/* Timer */}
                    {timeRemaining !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 flex justify-end"
                        >
                            <div className={`bg-base-100 p-3 rounded-xl shadow-lg flex items-center gap-2 
                        ${timeRemaining < 30 ? 'animate-pulse ring-2 ring-error/30' : ''}`}>
                                <ClockIcon className="w-5 h-5 text-primary" />
                                <span className={`font-mono text-lg ${timeRemaining < 60 ? 'text-error' : ''}`}>
                            {formatTimeRemaining(timeRemaining)}
                        </span>
                            </div>
                        </motion.div>
                    )}

                    <QuestionNavigationArrows
                        currentIndex={currentQuestionIndex}
                        totalQuestions={publication.questions?.length || 0}
                        onPrevious={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                        onNext={() => setCurrentQuestionIndex(i => Math.min((publication.questions?.length || 0) - 1, i + 1))}
                    />

                    {/* Question Box */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion?.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="bg-base-100 rounded-xl shadow-xl p-6 min-h-[460px] max-w-3xl mx-auto"
                        >
                            {isTrueFalseQuestion(currentQuestion!) && (
                                <TrueFalseQuestion
                                    question={currentQuestion}
                                    onAnswer={handleAnswer}
                                    initialAnswer={getCurrentQuestionResponse() as boolean | null}
                                />
                            )}
                            {isMultipleChoiceQuestion(currentQuestion!) && (
                                <MultipleChoiceQuestion
                                    question={currentQuestion}
                                    onAnswer={handleAnswer}
                                    initialAnswer={getCurrentQuestionResponse() as number[] | null}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right - Sidebar */}
                <div className="hidden md:block w-[300px] sticky top-[5rem] max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <QuizNavigation
                        questions={publication.questions || []}
                        currentQuestionIndex={currentQuestionIndex}
                        onQuestionChange={setCurrentQuestionIndex}
                        onCompleteQuiz={handleCompleteQuiz}
                        userResponses={userResponses}
                    />
                </div>

                <MobileNavigation
                    isOpen={showMobileNav}
                    onClose={() => setShowMobileNav(false)}
                    questions={publication.questions || []}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionChange={(index) => {
                        setCurrentQuestionIndex(index);
                        setShowMobileNav(false);
                    }}
                    onCompleteQuiz={handleCompleteQuiz}
                    userResponses={userResponses}
                />
            </div>
        </div>

    );
};
