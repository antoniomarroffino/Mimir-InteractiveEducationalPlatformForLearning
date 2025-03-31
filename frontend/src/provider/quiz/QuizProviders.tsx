import {QuizCRUDProvider} from "./QuizCRUDProvider.tsx";
import React from "react";

export const QuizProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizCRUDProvider>
            {children}
        </QuizCRUDProvider>
    );
}