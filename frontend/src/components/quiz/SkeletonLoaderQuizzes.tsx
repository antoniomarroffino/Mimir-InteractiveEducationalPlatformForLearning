import React from "react";

export const SkeletonLoaderQuizzes: React.FC = () => {
    return (
        <div className="space-y-3 py-4">
            {Array.from({length: 3}).map((_, idx) => (
                <div key={idx} className="skeleton h-6 rounded bg-base-300 w-full max-w-md mx-auto"/>
            ))}
        </div>
    );
};
