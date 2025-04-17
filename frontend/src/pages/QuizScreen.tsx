import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetQuizPublicationByCode } from '../hooks/quizPublication/useGetQuizPublicationByCode.ts';
import { useGetQuizById } from '../hooks/quiz/useGetQuizById.ts';
import { useQuizAttemptLocal } from '../hooks/quizAttempt/useQuizAttemptLocal.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { QuizDTO, QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { ClockIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { QuizQuestions } from '../components/common/QuizQuestions.tsx';
import { motion } from 'framer-motion';

const QuizScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCode } = useParams();

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
        { enabled: !hasStateData && !!publication }
    );

    const finalPublication = state?.publication ?? publication;
    const finalQuiz = state?.quiz ?? quiz;

    const { startQuizAttempt } = useQuizAttemptLocal();
    const { user, login } = useAuth();
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const handleStartQuiz = useCallback(async () => {
        if (!finalPublication) return;
        try {
            setIsStarting(true);
            await startQuizAttempt(finalPublication);
            setIsQuizStarted(true);
        } catch (err) {
            console.error('Error while starting the quiz:', err);
        } finally {
            setIsStarting(false);
        }
    }, [finalPublication, startQuizAttempt]);

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

    if (!finalPublication || !finalQuiz || isLoadingPublication || isLoadingQuiz) {
        return <LoadingSpinner />;
    }

    const formatTimeLimit = (minutes?: number | null) => {
        if (!minutes) return null;
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h${remainingMinutes ? ` ${remainingMinutes}m` : ''}`;
    };

    const renderAccessCard = () => {
        const isAnonymous = finalPublication.anonymous;
        const timeLimit = formatTimeLimit(finalQuiz.timeLimitMinutes);

        const content = isAnonymous
            ? {
                icon: '🧠',
                title: 'Ready to challenge yourself?',
                description: 'This is an anonymous quiz. No login required.',
                buttonText: 'Start the Quiz',
                action: handleStartQuiz,
                color: 'primary'
            }
            : !user
                ? {
                    icon: '🔒',
                    title: 'Login Required',
                    description: 'You must log in to access this quiz.',
                    buttonText: 'Login',
                    action: login,
                    color: 'warning'
                }
                : {
                    icon: '🚀',
                    title: 'Are you ready?',
                    description: 'Read the instructions carefully before starting.',
                    buttonText: 'Start the Quiz',
                    action: handleStartQuiz,
                    color: 'primary'
                };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`card w-full sm:w-[28rem] bg-${content.color}/20 shadow-xl backdrop-blur-sm`}
            >
                <div className="card-body items-center text-center">
                    <div className="text-5xl mb-2">{content.icon}</div>
                    <h3 className={`text-2xl font-bold text-${content.color}`}>{content.title}</h3>
                    <p className="text-base-content/80 mt-2">{content.description}</p>
                    {timeLimit && (
                        <div className="flex items-center justify-center gap-2 mt-4 text-base-content/70">
                            <ClockIcon className="w-5 h-5" />
                            <span>Time limit: {timeLimit}</span>
                        </div>
                    )}
                    <div className="card-actions justify-center mt-6">
                        <button
                            onClick={content.action}
                            disabled={isStarting}
                            className={`btn btn-${content.color} btn-wide text-white hover:scale-105 transition-transform`}
                        >
                            {isStarting ? 'Loading...' : content.buttonText}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 flex flex-col">
            <div className="bg-gradient-to-r from-primary to-secondary">
                <div className="container mx-auto px-4 py-10 text-center text-neutral-content">
                    <motion.h1
                        className="text-4xl font-extrabold tracking-tight mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {finalQuiz.name}
                    </motion.h1>
                    <motion.p
                        className="text-lg max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {finalQuiz.description}
                    </motion.p>
                </div>
            </div>

            <div className="flex-1 container mx-auto px-4 py-10">
                {!isQuizStarted ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        {renderAccessCard()}
                    </div>
                ) : (
                    <QuizQuestions
                        publication={finalPublication}
                        timeLimit={finalQuiz.timeLimitMinutes}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizScreen;
