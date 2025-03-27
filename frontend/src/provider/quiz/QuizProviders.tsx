import {QuizListProvider} from "./QuizListProvider.tsx";
import {QuizSelectionProvider} from "./QuizSelectionProvider.tsx";
import {QuizCRUDProvider} from "./QuizCRUDProvider.tsx";
import React from "react";

export const QuizProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizListProvider>
            <QuizSelectionProvider>
                <QuizCRUDProvider>
                    {children}
                </QuizCRUDProvider>
            </QuizSelectionProvider>
        </QuizListProvider>
    );
}