import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useGetQuizPublicationByCode} from '../../hooks/quizPublication/useGetQuizPublicationByCode.ts';
import {useGetQuizById} from '../../hooks/quiz/useGetQuizById.ts';
import {useQuizAttemptLocal} from '../../hooks/quizAttempt/useQuizAttemptLocal.ts';
import {useAuth} from '../../hooks/useAuth.ts';
import {QuizDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {formatMinutesDuration} from '../../utils/timeUtils.ts';
import {AnonymousAccessCard} from '../../components/quiz/AnonymousAccessCard.tsx';
import {LoginRequiredAccessCard} from '../../components/quiz/LoginRequiredAccessCard.tsx';
import {AuthenticatedAccessCard} from '../../components/quiz/AuthenticatedAccessCard.tsx';
import {QuizScreenHeader} from "./QuizScreenHeader.tsx";
import { motion } from 'framer-motion';
import {LoadingSpinner} from "../../components/common/LoadingSpinner.tsx";

const QuizScreenPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {accessCode} = useParams();

    const state = location.state as {
        publication?: QuizPublicationDTO;
        quiz?: QuizDTO;
    };

    const hasStateData = !!(state?.publication && state?.quiz);

    const {
        data: publication,
        isLoading: isLoadingPublication,
        error: errorPublication
    } = useGetQuizPublicationByCode(accessCode!, {
        enabled: !hasStateData
    });

    const {
        data: quiz,
        isLoading: isLoadingQuiz,
        error: errorQuiz
    } = useGetQuizById(
        publication?.courseId ?? '',
        publication?.folderId ?? '',
        publication?.quizId ?? '',
        {enabled: !hasStateData && !!publication}
    );

    const finalPublication = state?.publication ?? publication;
    const finalQuiz = state?.quiz ?? quiz;

    const {startQuizAttempt} = useQuizAttemptLocal();
    const {user, login} = useAuth();
    const [isStarting, setIsStarting] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setInitialLoading(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    const handleStartQuiz = useCallback(async () => {
        if (!finalPublication || !finalQuiz) return;
        try {
            setIsStarting(true);
            await startQuizAttempt(finalPublication);
            navigate(`/quiz/${accessCode}/questions`, {
                state: {publication: finalPublication, quiz: finalQuiz}
            });
        } catch (err) {
            console.error('Error while starting the quiz:', err);
        } finally {
            setIsStarting(false);
        }
    }, [finalPublication, finalQuiz, startQuizAttempt, navigate, accessCode]);

    const timeLimit = formatMinutesDuration(finalQuiz!.timeLimitMinutes);

    if (errorPublication || errorQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="alert alert-error shadow-lg">
                    <span>Error loading the quiz.</span>
                    <button className="btn btn-sm ml-4" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!finalPublication || !finalQuiz || isLoadingPublication || isLoadingQuiz || initialLoading) {
        return <LoadingSpinner fullScreen/>;
    }

    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100"
        >
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                <QuizScreenHeader
                    quiz={finalQuiz}
                    publication={finalPublication}
                />

                <div className="mt-8 flex flex-col items-center justify-center min-h-[calc(100vh-24rem)]">
                    <div className="w-full flex justify-center">
                        {finalPublication.anonymous ? (
                            <AnonymousAccessCard
                                timeLimit={timeLimit!}
                                onStart={handleStartQuiz}
                                loading={isStarting}
                            />
                        ) : !user ? (
                            <LoginRequiredAccessCard onLogin={login}/>
                        ) : (
                            <AuthenticatedAccessCard
                                timeLimit={timeLimit!}
                                onStart={handleStartQuiz}
                                loading={isStarting}
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default QuizScreenPage;
