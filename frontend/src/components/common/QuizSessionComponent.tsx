import React, {useState} from 'react';
import {useAuth} from "../../hooks/useAuth.ts";
import {FiHash} from "react-icons/fi";
import {useQuizRetrieve} from "../../hooks/useQuizRetrieve.ts";
import {useQuizJoin} from "../../hooks/useQuizJoin.ts";

export const QuizSessionComponent = () => {
    const {user} = useAuth();
    const {retrieveQuiz} = useQuizRetrieve();
    const [code, setCode] = useState('');

    const {handleJoin, errorMessage, isLoading} = useQuizJoin(code, retrieveQuiz);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleJoin();
        }
    };

    return (
        <section className="w-full max-w-md mx-auto">
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
                                disabled={isLoading}
                            />
                            <button
                                className="btn btn-primary join-item"
                                onClick={handleJoin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : user ? "Join" : "Login"}
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