import React from "react";
import {QuizPublicationCRUDProvider} from "./QuizPublicationCRUDProvider.tsx";
import {QuizPublicationVerificationProvider} from "./QuizPublicationVerificationProvider.tsx";
import {QuizPublicationSelectionProvider} from "./QuizPublicationSelectionProvider.tsx";

export const QuizPublicationProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizPublicationCRUDProvider>
            <QuizPublicationVerificationProvider>
                <QuizPublicationSelectionProvider>
                    {children}
                </QuizPublicationSelectionProvider>
            </QuizPublicationVerificationProvider>
        </QuizPublicationCRUDProvider>
    );
};