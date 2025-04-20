import React, {useState} from 'react';
import {useAuth} from "../../hooks/useAuth.ts";
import {FiHash} from "react-icons/fi";
import {QuizCodeAnalyzer} from "./QuizCodeAnalyzer.tsx";
import {useNavigate} from 'react-router-dom';
import {QuizPublicationDTO, QuizDTO} from "@dti-isin/backend-api-client";

export const QuizSessionComponent = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        setErrorMessage('');
    };

    const handleStartAnalyze = () => {
        if (code.trim()) {
            setIsAnalyzing(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStartAnalyze();
        }
    };

    const handleAnalyzeSuccess = (publication: QuizPublicationDTO, quiz: QuizDTO) => {
        setIsAnalyzing(false);
        navigate(`/quiz/${code}`, {
            state: {
                publication,
                quiz
            }
        });
    };

    const handleAnalyzeError = (message: string) => {
        setIsAnalyzing(false);
        setErrorMessage(message);
    };

    return (
        <section className="w-full max-w-md mx-auto relative">

            {isAnalyzing && (
                <QuizCodeAnalyzer
                    publicationCode={code}
                    onSuccess={handleAnalyzeSuccess}
                    onError={handleAnalyzeError}
                />
            )}

            {isAnalyzing && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-base-100 p-8 rounded-lg flex flex-col items-center gap-4">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-lg">Verifica del codice in corso...</p>
                    </div>
                </div>
            )}

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <FiHash className="text-4xl text-primary"/>
                    </div>

                    <h2 className="card-title text-2xl text-center">Join a Quiz</h2>
                    <p className="text-base-content/70 mb-6">Enter the code:</p>

                    <div className="w-full">
                        <div className="join w-full">
                            <input
                                type="text"
                                placeholder="Session Code"
                                className="input input-bordered join-item flex-1"
                                value={code}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="btn btn-primary join-item"
                                onClick={handleStartAnalyze}
                            >
                                {user ? "Join" : "Login"}
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-error mt-4">{errorMessage}</p>
                    )}

                    {!user && (
                        <p className="text-sm text-base-content/70 mt-4">
                            Login to access all features
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
