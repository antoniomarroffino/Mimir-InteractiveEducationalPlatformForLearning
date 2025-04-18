import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    QuizDTO,
    QuizPublicationDTO,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import { useQuizAttemptLocal } from "../hooks/quizAttempt/useQuizAttemptLocal";
import { useQuizAttemptAutosave } from "../hooks/quizAttempt/useQuizAttemptAutosave";
import { QuestionResponseFactory } from "../components/question/QuestionResponseFactory";
import { QuizExecutionHeader } from "../components/quiz/QuizExecutionHeader";
import { AnimatePresence } from "framer-motion";
import { QuestionNavigationArrows } from "../components/quiz/QuestionNavigationArrows";
import { TimeWarningPopup } from "../components/quiz/TimeWarningPopup";
import { CurrentQuestionCard } from "../components/quiz/CurrentQuestionCard";
import { SidebarQuizExecution } from "../components/quiz/SidebarQuizExecution";

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

    useEffect(() => {
        const timer = setInterval(() => {
            setUserResponses((prev) => {
                const updated = [...prev];
                if (updated[currentQuestionIndex]) {
                    updated[currentQuestionIndex] = {
                        ...updated[currentQuestionIndex],
                        timeSpent: (updated[currentQuestionIndex]?.timeSpent || 0) + 1
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

    const isTrueFalseQuestion = (q: QuestionDTO): q is TrueFalseQuestionDTO =>
        q.type === QuestionType.TrueFalse;
    const isMultipleChoiceQuestion = (q: QuestionDTO): q is MultipleChoiceQuestionDTO =>
        q.type === QuestionType.MultipleChoice;

    const handleAnswer = useCallback(
        (answer: boolean | number[] | null) => {
            const currentQuestion = publication?.questions?.[currentQuestionIndex];
            if (!currentQuestion) return;
            setUserResponses((prev) => {
                const updated = [...prev];
                const timeSpent = updated[currentQuestionIndex]?.timeSpent || 0;
                if (isTrueFalseQuestion(currentQuestion)) {
                    updated[currentQuestionIndex] = {
                        ...QuestionResponseFactory.createResponse(
                            QuestionType.TrueFalse,
                            currentQuestion.id!,
                            typeof answer === "boolean" ? answer : undefined
                        ),
                        timeSpent
                    };
                } else if (isMultipleChoiceQuestion(currentQuestion)) {
                    updated[currentQuestionIndex] = {
                        ...QuestionResponseFactory.createResponse(
                            QuestionType.MultipleChoice,
                            currentQuestion.id!,
                            Array.isArray(answer) ? answer : []
                        ),
                        timeSpent
                    };
                }
                return updated;
            });
        },
        [currentQuestionIndex, publication?.questions]
    );

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

    const currentQuestion = publication.questions?.[currentQuestionIndex];

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-primary/10 to-secondary/10">
            <QuizExecutionHeader title={quiz.name} description={quiz.description} />

            <div className="flex-1 flex flex-col-reverse md:flex-row overflow-hidden py-6 container mx-auto px-4 gap-6">

            {/* Colonna principale - Domande */}
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
                                answer={getCurrentQuestionResponse()}
                                onAnswer={handleAnswer}
                            />
                        </AnimatePresence>
                    </div>

                    {showPopup && <TimeWarningPopup onClose={() => setShowPopup(false)} />}
                </div>

                {/* Sidebar - destra su desktop, sopra su mobile */}
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
