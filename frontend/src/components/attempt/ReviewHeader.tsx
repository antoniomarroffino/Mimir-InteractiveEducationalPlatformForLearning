import React from 'react';

interface ReviewHeaderProps {
    totalAttempts: number;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({totalAttempts}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Your Quiz Journey
                </h2>
                <p className="text-base-content/70 mt-2">
                    Track your progress and achievements
                </p>
            </div>

            <div className="w-full sm:w-auto">
                <div className="stats bg-base-100 shadow w-full sm:w-auto">
                    <div className="stat px-4 py-2 sm:py-4">
                        <div className="stat-title text-sm sm:text-base">Total Attempts</div>
                        <div className="stat-value text-primary text-2xl sm:text-3xl">
                            {totalAttempts}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};