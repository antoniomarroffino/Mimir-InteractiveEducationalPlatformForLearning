import React, {useCallback, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {QuestionResponseDTO, QuizAttemptDTO, QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal";
import {useQuizAttemptAutosave} from "../hooks/quizAttempt/useQuizAttemptAutosave";
import {QuizExecutionHeader} from "../components/quiz/QuizExecutionHeader";
import {AnimatePresence, motion} from "framer-motion";
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
    };

    const publication = state?.publication;
    const quiz = state?.quiz;

    const {
        currentAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        clearQuizAttempt
    } = useQuizAttemptLocal();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponses, setUserResponses] = useState<QuestionResponseDTO[]>(
        currentAttempt?.responses || new Array(publication?.questions?.length || 0).fill(null)
    );

    useQuizAttemptAutosave(15000);
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
        },
        [currentQuestion, currentQuestionIndex, userResponses]
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
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100"
        >
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                <QuizExecutionHeader
                    quiz={quiz}
                    publication={publication}
                />

                <div className="mt-8">
                    <div className="flex flex-col-reverse md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="space-y-6">
                                <QuestionNavigationArrows
                                    currentIndex={currentQuestionIndex}
                                    totalQuestions={publication.questions!.length}
                                    onPrevious={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                                    onNext={() => setCurrentQuestionIndex(i => Math.min(publication.questions!.length - 1, i + 1))}
                                />

                                <div className="flex justify-center">
                                    <AnimatePresence mode="wait">
                                        <CurrentQuestionCard
                                            question={currentQuestion}
                                            answer={currentResponse}
                                            onAnswer={handleAnswer}
                                        />
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-80 lg:w-96">
                            <SidebarQuizExecution
                                quizTimeLimit={quiz.timeLimitMinutes}
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
                    </div>
                </div>
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
        </motion.section>
    );
};

export default QuizQuestionsPage;