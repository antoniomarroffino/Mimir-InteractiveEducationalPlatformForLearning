import React from "react";
import {FiFileText} from "react-icons/fi";

export const EmptyStateQuizzes: React.FC = () => {
    return (
        <div className="text-center text-base-content/70 py-6 space-y-2">
            <FiFileText className="mx-auto text-3xl text-primary/60"/>
            <p className="text-sm font-medium">No quizzes found in this folder.</p>
            <p className="text-xs">Use the button below to create your first quiz.</p>
        </div>
    );
};