import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    QuestionResponseDTO,
    QuizDTO,
    QuizPublicationDTO
} from "@dti-isin/backend-api-client";
import { useQuizAttemptLocal } from "../hooks/quizAttempt/useQuizAttemptLocal";
import { useQuizAttemptAutosave } from "../hooks/quizAttempt/useQuizAttemptAutosave";
import { QuizExecutionHeader } from "../components/quiz/QuizExecutionHeader";
import { AnimatePresence } from "framer-motion";
import { QuestionNavigationArrows } from "../components/quiz/QuestionNavigationArrows";
import { TimeWarningPopup } from "../components/quiz/TimeWarningPopup";
import { CurrentQuestionCard } from "../components/quiz/CurrentQuestionCard";
import { SidebarQuizExecution } from "../components/quiz/SidebarQuizExecution";
import {
    createUpdatedResponse,
    getCurrentQuestionResponse
} from "../utils/questionUtils";
import {useTrackTimeSpent} from "../hooks/quizAttempt/useTrackTimeSpent.ts";

const QuizQuestionsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCode } = useParams();

    const state = location.state as {
        publication?: QuizPublicationDTO;
        quiz?: QuizDTO;
    };

    const publication = state?.publication;
    const quiz = state?.quiz;

    const {
        currentAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt
    } = useQuizAttemptLocal();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponses, setUserResponses] = useState<QuestionResponseDTO[]>(
        currentAttempt?.responses || new Array(publication?.questions?.length || 0).fill(null)
    );

    const [showPopup, setShowPopup] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(
        quiz?.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : null
    );

    useQuizAttemptAutosave(15000);
    useTrackTimeSpent(currentQuestionIndex, setUserResponses);

    useEffect(() => {
        if (!timeRemaining) return;
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (!prev || prev <= 0) {
                    clearInterval(timer);
                    handleCompleteQuiz();
                    return 0;
                }
                if (prev === 60) setShowPopup(true);
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeRemaining]);

    useEffect(() => {
        updateQuizAttemptResponses(userResponses);
    }, [userResponses, updateQuizAttemptResponses]);

    const currentQuestion = useMemo(() => {
        return publication?.questions?.[currentQuestionIndex];
    }, [publication?.questions, currentQuestionIndex]);

    const currentResponse = useMemo(() => {
        return getCurrentQuestionResponse(
            currentQuestion,
            userResponses,
            currentQuestionIndex
        );
    }, [currentQuestion, userResponses, currentQuestionIndex]);

    const handleAnswer = useCallback(
        (answer: boolean | number[] | null) => {
            if (!currentQuestion) return;

            const updated = [...userResponses];
            updated[currentQuestionIndex] = createUpdatedResponse(
                currentQuestion,
                answer,
                userResponses[currentQuestionIndex]?.timeSpent || 0
            );

            setUserResponses(updated);
        },
        [currentQuestion, currentQuestionIndex, userResponses]
    );

    const handleCompleteQuiz = useCallback(async () => {
        try {
            const completedAttempt = await completeQuizAttempt();
            navigate(`/results/${completedAttempt.id!}`, {
                state: { attempt: completedAttempt, quizPublication: publication }
            });
        } catch (error) {
            console.error("Error during completing quiz:", error);
        }
    }, [completeQuizAttempt, navigate, publication]);

    if (!publication || !quiz) {
        navigate(`/quiz/${accessCode}`);
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-primary/10 to-secondary/10">
            <QuizExecutionHeader title={quiz.name} description={quiz.description} />

            <div className="flex-1 flex flex-col-reverse md:flex-row overflow-hidden py-6 container mx-auto px-4 gap-6">
                <div className="flex-1 flex flex-col justify-start">
                    <QuestionNavigationArrows
                        currentIndex={currentQuestionIndex}
                        totalQuestions={publication.questions!.length}
                        onPrevious={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                        onNext={() => setCurrentQuestionIndex(i => Math.min(publication.questions!.length - 1, i + 1))}
                    />

                    <div className="mt-6 flex justify-center">
                        <AnimatePresence mode="wait">
                            <CurrentQuestionCard
                                question={currentQuestion}
                                answer={currentResponse}
                                onAnswer={handleAnswer}
                            />
                        </AnimatePresence>
                    </div>

                    {showPopup && <TimeWarningPopup onClose={() => setShowPopup(false)} />}
                </div>

                <SidebarQuizExecution
                    timeRemaining={timeRemaining}
                    questions={publication.questions!}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionChange={setCurrentQuestionIndex}
                    onCompleteQuiz={handleCompleteQuiz}
                    userResponses={userResponses}
                />
            </div>
        </div>
    );
};

export default QuizQuestionsPage;
