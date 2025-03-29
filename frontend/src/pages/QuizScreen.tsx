import React, {useCallback, useState} from 'react';
import {useQuizRetrieve} from "../hooks/useQuizRetrieve.ts";
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal.ts";
import {QuizQuestions} from "../components/common/QuizQuestions.tsx";
import {LoadingSpinner} from '../components/common/LoadingSpinner.tsx';
import {useAuth} from "../hooks/useAuth.ts";

export const QuizScreen: React.FC = () => {
    const {quiz, quizPublication, error: errorQuiz} = useQuizRetrieve();
    const {startQuizAttempt} = useQuizAttemptLocal();
    const {user, login} = useAuth();
    const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleStartQuiz = useCallback(async () => {
        if (quizPublication && quiz) {
            try {
                setIsLoading(true);

                await startQuizAttempt(quizPublication, quiz);
                setIsQuizStarted(true);
            } catch (error) {
                console.error('Errore durante l\'avvio del quiz:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [quizPublication, quiz, startQuizAttempt]);

    const renderQuizPreparation = () => {
        // Se il quiz è anonimo, il tasto è sempre attivo
        if (quizPublication?.anonymous) {
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

        // Se il quiz non è anonimo e l'utente non è loggato
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
                            <p className="text-base-content mt-2">Devi effettuare il login per accedere a questo quiz.</p>
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

        // Se il quiz non è anonimo e l'utente è loggato
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

    if (errorQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6"
                             fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>Error fetching quiz: {errorQuiz.message}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz || isLoading) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section con gradiente */}
            <div className="hero py-16 bg-gradient-to-r from-primary to-secondary">
                <div className="hero-content text-center text-neutral-content">
                    <div>
                        <h1 className="text-5xl font-bold mb-4">{quiz.name}</h1>
                        <p className="text-xl mb-8">{quiz.description}</p>
                    </div>
                </div>
            </div>

            {/* Quiz Preparation Section */}
            <section className="py-16 relative">
                {/* Ombra superiore */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/10"></div>

                <div className="container mx-auto px-4">
                    {!isQuizStarted ? renderQuizPreparation() : (
                        <QuizQuestions
                            quiz={quiz!}
                        />
                    )}
                </div>
            </section>
        </div>
    );
};

export default QuizScreen;