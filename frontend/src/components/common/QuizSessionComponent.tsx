import React, { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth.ts";
import { FiHash } from "react-icons/fi";
import { QuizCodeAnalyzer } from "./QuizCodeAnalyzer.tsx";

export const QuizSessionComponent = () => {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setErrorMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && code.trim()) {
      setIsAnalyzing(true);
    }
  };

  const handlePressJoinButton = () => {
    if (code.trim()) {
      setIsAnalyzing(true);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto">
      {isAnalyzing && (
        <QuizCodeAnalyzer
          publicationCode={code}
          onClose={() => setIsAnalyzing(false)}
          onError={(error) => setErrorMessage(error)}
        />
      )}

      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="card-body items-center text-center">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <FiHash className="text-4xl text-primary" />
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
                onClick={handlePressJoinButton}
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
