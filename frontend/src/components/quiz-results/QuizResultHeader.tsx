import React from 'react';

interface QuizResultHeaderProps {
    earnedPoints: number;
    totalPoints: number;
    totalQuestions: number;
}

export const QuizResultHeader: React.FC<QuizResultHeaderProps> = ({
                                                                      earnedPoints,
                                                                      totalPoints
                                                                  }) => {
    const getScoreEmoji = (earned: number, total: number) => {
        const percentage = (earned / total) * 100;
        if (percentage === 100) return '🏆';
        if (percentage >= 90) return '🌟';
        if (percentage >= 70) return '👍';
        if (percentage >= 50) return '🤔';
        return '😕';
    };

    return (
        <div className="text-center">
            <h2 className="text-4xl font-bold text-primary mb-4">
                Quiz Results
            </h2>
            <div className="text-6xl mb-4">
                {getScoreEmoji(earnedPoints, totalPoints)}
            </div>
        </div>
    );
};