import React from 'react';

interface QuizScoreStatsProps {
    score: number;
    totalQuestions: number;
}

export const QuizScoreStats: React.FC<QuizScoreStatsProps> = ({ score, totalQuestions }) => {
    return (
        <div className="stats shadow-lg w-full">
            <div className="stat">
                <div className="stat-title">Score</div>
                <div className="stat-value text-primary">
                    {score} / {totalQuestions}
                </div>
                <div className="stat-desc">
                    {Math.round((score / (totalQuestions || 1)) * 100)}%
                    correct answers
                </div>
            </div>
        </div>
    );
};