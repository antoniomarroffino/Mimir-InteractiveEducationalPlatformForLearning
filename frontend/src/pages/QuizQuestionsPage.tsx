import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {QuestionResponseDTO, QuizAttemptDTO, QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal";
import {useQuizAttemptAutosave} from "../hooks/quizAttempt/useQuizAttemptAutosave";
import {QuizExecutionHeader} from "../components/quiz/QuizExecutionHeader";
import {AnimatePresence} from "framer-motion";
import {QuestionNavigationArrows} from "../components/quiz/QuestionNavigationArrows";
import {CurrentQuestionCard} from "../components/quiz/CurrentQuestionCard";
import {SidebarQuizExecution} from "../components/quiz/SidebarQuizExecution";
import {createUpdatedResponse, getCurrentQuestionResponse} from "../utils/questionUtils";
import {useTrackTimeSpent} from "../hooks/quizAttempt/useTrackTimeSpent";
import {TimeExpiredPopup} from "../components/quiz/TimeExpiredPopup.tsx";

const QuizQuestionsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {accessCode} = useParams();

    const [completedAttempt, setCompletedAttempt] = useState<QuizAttemptDTO | null>(null);


    const state = location.state as {
        publication?: QuizPublicationDTO;
        quiz?: QuizDTO;
        attempt?: QuizAttemptDTO;
    };

    const publication = state?.publication;
    const quiz = state?.quiz;
    const attempt = state?.attempt;

    const {
        currentAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        clearQuizAttempt,
        resumeAttempt
    } = useQuizAttemptLocal();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponses, setUserResponses] = useState<QuestionResponseDTO[]>(
        currentAttempt?.responses || new Array(publication?.questions?.length || 0).fill(null)
    );
    const [finalTimeRemainingMinutes, setFinalTimeRemainingMinutes] = useState<number>();

    useEffect(() => {
        if (attempt && publication) {
            resumeAttempt(attempt, publication);
            setUserResponses(attempt.responses || []);
            updateQuizAttemptResponses(attempt.responses || []);
            setFinalTimeRemainingMinutes(attempt?.timeRemainingSeconds ? attempt.timeRemainingSeconds / 60 : undefined);
        }
    }, [attempt, publication, resumeAttempt, updateQuizAttemptResponses]);

    useQuizAttemptAutosave(5000);
    useTrackTimeSpent(currentQuestionIndex, setUserResponses);

    const onMinuteLeft = useCallback(() => {
    }, []);

    const onExpire = useCallback(async () => {
        updateQuizAttemptResponses(userResponses);
        const attempt = await completeQuizAttempt(userResponses);
        clearQuizAttempt();
        setCompletedAttempt(attempt);
    }, [
        userResponses,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        clearQuizAttempt
    ]);


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
            updateQuizAttemptResponses(updated);
        },
        [currentQuestion, currentQuestionIndex, updateQuizAttemptResponses, userResponses]
    );

    const handleCompleteQuiz = useCallback(async () => {
        const completedAttempt = await completeQuizAttempt(userResponses);
        navigate(`/results/${completedAttempt.id!}`, {
            state: {attempt: completedAttempt, quizPublication: publication}
        });
    }, [userResponses, completeQuizAttempt, navigate, publication]);

    if (!publication || !quiz) {
        navigate(`/quiz/${accessCode}`);
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-primary/10 to-secondary/10">
            <QuizExecutionHeader title={quiz.name} description={quiz.description}/>

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
                </div>

                <SidebarQuizExecution
                    key={finalTimeRemainingMinutes}
                    quizTimeLimit={attempt ? finalTimeRemainingMinutes : quiz.timeLimitMinutes}
                    questions={publication.questions!}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionChange={setCurrentQuestionIndex}
                    onCompleteQuiz={handleCompleteQuiz}
                    userResponses={userResponses}
                    updateQuizAttemptResponses={updateQuizAttemptResponses}
                    completeQuizAttempt={completeQuizAttempt}
                    publication={publication}
                    navigate={navigate}
                    onExpire={onExpire}
                    onMinuteLeft={onMinuteLeft}
                />
            </div>

            {completedAttempt && (
                <TimeExpiredPopup
                    onConfirm={() => {
                        navigate(`/results/${completedAttempt.id!}`, {
                            state: {
                                attempt: completedAttempt,
                                quizPublication: publication
                            }
                        });
                    }}
                />
            )}
        </div>

    );
};

export default QuizQuestionsPage;
