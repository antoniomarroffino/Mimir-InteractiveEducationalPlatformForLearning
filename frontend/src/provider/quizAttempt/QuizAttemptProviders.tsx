import React from "react";
import { QuizAttemptListProvider } from "./QuizAttemptListProvider.tsx";
import { QuizAttemptCRUDProvider } from "./QuizAttemptCRUDProvider.tsx";

export const QuizAttemptProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizAttemptListProvider>
            <QuizAttemptCRUDProvider>
                {children}
            </QuizAttemptCRUDProvider>
        </QuizAttemptListProvider>
    );
};