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
    const avgPerQuestion = totalQuestions > 0 ? (totalPoints / totalQuestions).toFixed(1) : '-';

    return (
        <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center w-full">
            <div className="flex-1 bg-base-100 shadow-md rounded-xl p-4 text-center">
                <div className="text-sm sm:text-base font-medium text-base-content/70">Score</div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                    {earnedPoints} / {totalPoints}
                </div>
                <div className="text-xs sm:text-sm text-base-content/60 mt-1">
                    {Math.round(percentage)}% success rate
                </div>
            </div>

            <div className="flex-1 bg-base-100 shadow-md rounded-xl p-4 text-center">
                <div className="text-sm sm:text-base font-medium text-base-content/70">Questions</div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                    {totalQuestions}
                </div>
                <div className="text-xs sm:text-sm text-base-content/60 mt-1">
                    Avg {avgPerQuestion} pts per question
                </div>
            </div>
        </div>
    );
};
