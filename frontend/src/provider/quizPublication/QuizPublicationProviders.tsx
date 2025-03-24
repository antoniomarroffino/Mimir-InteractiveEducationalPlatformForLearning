import React from "react";
import {QuizPublicationCRUDProvider} from "./QuizPublicationCRUDProvider.tsx";
import {QuizPublicationVerificationProvider} from "./QuizPublicationVerificationProvider.tsx";

export const QuizPublicationProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizPublicationCRUDProvider>
            <QuizPublicationVerificationProvider>
                {children}
            </QuizPublicationVerificationProvider>
        </QuizPublicationCRUDProvider>
    );
};