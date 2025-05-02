import React from 'react';
import {getScoreEmoji} from '../../utils/scoreUtils';

interface QuizResultHeaderProps {
    earnedPoints: number;
    totalPoints: number;
    totalQuestions: number;
}

export const QuizResultHeader: React.FC<QuizResultHeaderProps> = ({
                                                                      earnedPoints,
                                                                      totalPoints
                                                                  }) => {
    return (
        <div className="text-center px-2 sm:px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Quiz Results
            </h2>
            <div className="text-5xl sm:text-6xl mb-4">
                {getScoreEmoji(earnedPoints, totalPoints)}
            </div>
        </div>
    );
};
