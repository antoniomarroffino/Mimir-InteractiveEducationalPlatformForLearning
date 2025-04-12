import React from 'react';

interface QuizScoreStatsProps {
    earnedPoints: number;
    totalPoints: number;
    totalQuestions: number;
}

export const QuizScoreStats: React.FC<QuizScoreStatsProps> = ({
                                                                  earnedPoints,
                                                                  totalPoints,
                                                                  totalQuestions
                                                              }) => {
    const percentage = (earnedPoints / (totalPoints || 1)) * 100;

    return (
        <div className="stats shadow-lg w-full">
            <div className="stat">
                <div className="stat-title">Score</div>
                <div className="stat-value text-primary">
                    {earnedPoints} / {totalPoints} points
                </div>
                <div className="stat-desc">
                    {Math.round(percentage)}% success rate
                </div>
            </div>
            <div className="stat">
                <div className="stat-title">Questions</div>
                <div className="stat-value">{totalQuestions}</div>
                <div className="stat-desc">
                    Average {(totalPoints / totalQuestions).toFixed(1)} points per question
                </div>
            </div>
        </div>
    );
};