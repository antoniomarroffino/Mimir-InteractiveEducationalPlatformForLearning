import React, {useCallback, useState} from 'react';
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal.ts";
import {QuizQuestions} from "./common/QuizQuestions.tsx";
import {LoadingSpinner} from './common/LoadingSpinner.tsx';
import {useAuth} from "../hooks/useAuth.ts";
import {QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {useGetQuizById} from "../hooks/quiz/useGetQuizById.ts";
import {ClockIcon} from "@heroicons/react/24/outline";

interface QuizPreStartProps {
    publication: QuizPublicationDTO;
}

const QuizPreStart: React.FC<QuizPreStartProps> = ({publication}) => {
    const {
        data: quiz,
        isLoading: isLoadingQuiz,
        error: errorGetQuiz
    } = useGetQuizById(publication.courseId, publication.folderId, publication.quizId);
    const {startQuizAttempt} = useQuizAttemptLocal();
    const {user, login} = useAuth();
    const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const formatTimeLimit = (minutes: number | undefined | null) => {
        if (!minutes) return null;
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h${remainingMinutes ? ` ${remainingMinutes}m` : ''}`;
    };

    const handleStartQuiz = useCallback(async () => {
        if (quiz) {
            try {
                setIsLoading(true);
                await startQuizAttempt(publication);
                setIsQuizStarted(true);
            } catch (error) {
                console.error('Errore durante l\'avvio del quiz:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [publication, quiz, startQuizAttempt]);

    const renderQuizPreparation = () => {
        const renderTimeLimit = () => {
            if (!quiz?.timeLimitMinutes) return null;
            return (
                <div className="flex items-center justify-center gap-2 mt-4 text-base-content/80">
                    <ClockIcon className="w-5 h-5"/>
                    <span>Time limit: {formatTimeLimit(quiz.timeLimitMinutes)}</span>
                </div>
            );
        };

        if (publication.anonymous) {
            return (
                <div className="flex justify-center">
                    <div className="card w-96 bg-primary/20 shadow-xl backdrop-blur-sm">
                        <div className="card-body items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 className="w-16 h-16 mb-4 stroke-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <h3 className="card-title text-primary">Pronto per iniziare?</h3>
                            <p className="text-base-content mt-2">Preparati a metterti alla prova!</p>
                            {renderTimeLimit()}
                            <div className="card-actions justify-center mt-4">
                                <button
                                    onClick={handleStartQuiz}
                                    disabled={isLoading}
                                    className="btn btn-primary btn-wide hover:scale-105 transition-transform"
                                >
                                    {isLoading ? 'Caricamento...' : 'Inizia il Quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (!user) {
            return (
                <div className="flex justify-center">
                    <div className="card w-96 bg-warning/20 shadow-xl backdrop-blur-sm">
                        <div className="card-body items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 className="w-16 h-16 mb-4 stroke-warning">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            <h3 className="card-title text-warning">Accesso Richiesto</h3>
                            <p className="text-base-content mt-2">Devi effettuare il login per accedere a questo
                                quiz.</p>
                            <div className="card-actions justify-center mt-4">
                                <button
                                    onClick={login}
                                    className="btn btn-warning btn-wide hover:scale-105 transition-transform"
                                >
                                    Effettua il Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex justify-center">
                <div className="card w-96 bg-primary/20 shadow-xl backdrop-blur-sm">
                    <div className="card-body items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             className="w-16 h-16 mb-4 stroke-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3 className="card-title text-primary">Pronto per iniziare?</h3>
                        <p className="text-base-content mt-2">Preparati a metterti alla prova!</p>
                        {renderTimeLimit()}
                        <div className="card-actions justify-center mt-4">
                            <button
                                onClick={handleStartQuiz}
                                disabled={isLoading}
                                className="btn btn-primary btn-wide hover:scale-105 transition-transform"
                            >
                                {isLoading ? 'Caricamento...' : 'Inizia il Quiz'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (errorGetQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6"
                             fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>Error fetching quiz: {errorGetQuiz.message}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz || isLoadingQuiz || isLoading) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <div className="bg-gradient-to-r from-primary to-secondary">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-neutral-content">
                        <h1 className="text-4xl font-bold mb-2">{quiz.name}</h1>
                        <p className="text-lg mb-4">{quiz.description}</p>
                        {quiz.timeLimitMinutes && (
                            <div className="flex items-center justify-center gap-2">
                                <ClockIcon className="w-5 h-5"/>
                                <span>Time limit: {formatTimeLimit(quiz.timeLimitMinutes)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/10"></div>

                <div className="container mx-auto px-4 py-8">
                    {!isQuizStarted ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            {renderQuizPreparation()}
                        </div>
                    ) : (
                        <QuizQuestions
                            publication={publication!}
                            timeLimit={quiz.timeLimitMinutes}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPreStart;