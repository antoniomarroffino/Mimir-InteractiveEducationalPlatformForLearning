import React from "react";
import {QuizPublicationCRUDProvider} from "./QuizPublicationCRUDProvider.tsx";

export const QuizPublicationProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizPublicationCRUDProvider>
            {children}
        </QuizPublicationCRUDProvider>
    );
};