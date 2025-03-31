import React from "react";
import {QuizPublicationCRUDProvider} from "./QuizPublicationCRUDProvider.tsx";
import {QuizPublicationSelectionProvider} from "./QuizPublicationSelectionProvider.tsx";

export const QuizPublicationProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizPublicationCRUDProvider>
            <QuizPublicationSelectionProvider>
                {children}
            </QuizPublicationSelectionProvider>
        </QuizPublicationCRUDProvider>
    );
};