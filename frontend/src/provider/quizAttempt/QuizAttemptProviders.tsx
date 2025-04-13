import React from "react";
import {QuizAttemptCRUDProvider} from "./QuizAttemptCRUDProvider.tsx";
import {QuizAttemptLocalProvider} from "./QuizAttemptLocalProvider.tsx";

export const QuizAttemptProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizAttemptCRUDProvider>
            <QuizAttemptLocalProvider>
                {children}
            </QuizAttemptLocalProvider>
        </QuizAttemptCRUDProvider>
    );
};