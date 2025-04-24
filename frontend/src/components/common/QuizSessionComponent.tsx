import React, {useState} from 'react';
import {useAuth} from "../../hooks/useAuth.ts";
import {FiHash} from "react-icons/fi";
import {QuizCodeAnalyzer} from "./QuizCodeAnalyzer.tsx";
import {useNavigate} from 'react-router-dom';
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";

export const QuizSessionComponent = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.toUpperCase());
        setErrorMessage('');
    };

    const handleStartAnalyze = () => {
        if (code.trim()) {
            setIsAnalyzing(true);
        } else {
            setErrorMessage('Please enter a code');
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
        <div className="w-full max-w-md mx-auto relative">
            {isAnalyzing && (
                <QuizCodeAnalyzer
                    publicationCode={code}
                    onSuccess={handleAnalyzeSuccess}
                    onError={handleAnalyzeError}
                />
            )}

            {isAnalyzing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-base-100 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-4 w-full max-w-xs mx-4">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-base sm:text-lg text-center">Verifying code...</p>
                    </div>
                </div>
            )}

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow mx-4 sm:mx-0">
                <div className="card-body items-center text-center p-4 sm:p-6">
                    <div className="p-3 bg-primary/10 rounded-full mb-3">
                        <FiHash className="text-2xl sm:text-3xl text-primary"/>
                    </div>

                    <h2 className="card-title text-lg sm:text-xl text-center mb-1">Join a Quiz</h2>
                    <p className="text-xs sm:text-sm text-base-content/70 mb-4">Enter the code:</p>

                    <div className="w-full space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                            <input
                                type="text"
                                placeholder="Session Code"
                                className="input input-bordered w-full sm:rounded-r-none text-base sm:text-lg uppercase"
                                value={code}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                                autoCapitalize="characters"
                                maxLength={6}
                            />
                            <button
                                className="btn btn-primary w-full sm:w-auto sm:rounded-l-none"
                                onClick={handleStartAnalyze}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    user ? "Join" : "Login"
                                )}
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="text-xs sm:text-sm text-error bg-error/10 p-2 rounded">
                                {errorMessage}
                            </div>
                        )}

                        {!user && (
                            <p className="text-xs text-base-content/70">
                                Login to access all features
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};