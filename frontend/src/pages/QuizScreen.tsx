import React, {useCallback, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useGetQuizPublicationByCode} from '../hooks/quizPublication/useGetQuizPublicationByCode.ts';
import {useGetQuizById} from '../hooks/quiz/useGetQuizById.ts';
import {useQuizAttemptLocal} from '../hooks/quizAttempt/useQuizAttemptLocal.ts';
import {useAuth} from '../hooks/useAuth.ts';
import {QuizDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {ClockIcon} from '@heroicons/react/24/outline';
import {LoadingSpinner} from '../components/common/LoadingSpinner.tsx';
import {QuizQuestions} from '../components/common/QuizQuestions.tsx';

const QuizScreen: React.FC = () => {
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
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const handleStartQuiz = useCallback(async () => {
        if (!finalPublication) {
            console.error("Tentativo di avvio quiz senza publication.");
            return;
        }
        try {
            setIsStarting(true);
            await startQuizAttempt(finalPublication);
            setIsQuizStarted(true);
        } catch (err) {
            console.error('Errore durante l\'avvio del quiz:', err);
        } finally {
            setIsStarting(false);
        }
    }, [finalPublication, startQuizAttempt]);

    if (errorPublication || errorQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="alert alert-error shadow-lg">
                    <span>Errore nel caricamento del quiz.</span>
                    <button className="btn btn-sm ml-4" onClick={() => navigate('/')}>
                        Torna alla home
                    </button>
                </div>
            </div>
        );
    }

    if (!finalPublication || !finalQuiz || isLoadingPublication || isLoadingQuiz) {
        return <LoadingSpinner/>;
    }

    const formatTimeLimit = (minutes?: number | null) => {
        if (!minutes) return null;
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h${remainingMinutes ? ` ${remainingMinutes}m` : ''}`;
    };

    const renderQuizPreparation = () => {
        if (finalPublication.anonymous) {
            return renderCard({
                type: 'primary',
                title: 'Pronto per iniziare?',
                description: 'Preparati a metterti alla prova!',
                buttonLabel: 'Inizia il Quiz',
                buttonAction: handleStartQuiz,
                disabled: isStarting,
                loading: isStarting
            });
        }

        if (!user) {
            return renderCard({
                type: 'warning',
                title: 'Accesso Richiesto',
                description: 'Devi effettuare il login per accedere a questo quiz.',
                buttonLabel: 'Effettua il Login',
                buttonAction: login
            });
        }

        return renderCard({
            type: 'primary',
            title: 'Pronto per iniziare?',
            description: 'Preparati a metterti alla prova!',
            buttonLabel: 'Inizia il Quiz',
            buttonAction: handleStartQuiz,
            disabled: isStarting,
            loading: isStarting
        });
    };

    const renderCard = ({
                            type,
                            title,
                            description,
                            buttonLabel,
                            buttonAction,
                            disabled,
                            loading
                        }: {
        type: 'primary' | 'warning';
        title: string;
        description: string;
        buttonLabel: string;
        buttonAction: () => void;
        disabled?: boolean;
        loading?: boolean;
    }) => {
        return (
            <div className="flex justify-center">
                <div className={`card w-96 bg-${type}/20 shadow-xl backdrop-blur-sm`}>
                    <div className="card-body items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             className={`w-16 h-16 mb-4 stroke-${type}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d={type === 'warning'
                                      ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                      : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'}
                            />
                        </svg>
                        <h3 className={`card-title text-${type}`}>{title}</h3>
                        <p className="text-base-content mt-2">{description}</p>
                        {finalQuiz.timeLimitMinutes && (
                            <div className="flex items-center justify-center gap-2 mt-4 text-base-content/80">
                                <ClockIcon className="w-5 h-5"/>
                                <span>Time limit: {formatTimeLimit(finalQuiz.timeLimitMinutes)}</span>
                            </div>
                        )}
                        <div className="card-actions justify-center mt-4">
                            <button
                                onClick={buttonAction}
                                disabled={disabled}
                                className={`btn btn-${type} btn-wide hover:scale-105 transition-transform`}
                            >
                                {loading ? 'Caricamento...' : buttonLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <div className="bg-gradient-to-r from-primary to-secondary">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-neutral-content">
                        <h1 className="text-4xl font-bold mb-2">{finalQuiz.name}</h1>
                        <p className="text-lg mb-4">{finalQuiz.description}</p>
                        {finalQuiz.timeLimitMinutes && (
                            <div className="flex items-center justify-center gap-2">
                                <ClockIcon className="w-5 h-5"/>
                                <span>Time limit: {formatTimeLimit(finalQuiz.timeLimitMinutes)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/10"/>
                <div className="container mx-auto px-4 py-8">
                    {!isQuizStarted ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            {renderQuizPreparation()}
                        </div>
                    ) : (
                        <QuizQuestions
                            publication={finalPublication}
                            timeLimit={finalQuiz.timeLimitMinutes}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizScreen;
