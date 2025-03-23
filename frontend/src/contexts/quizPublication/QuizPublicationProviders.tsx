import React from "react";
import {QuizPublicationCRUDProvider} from "./QuizPublicationCRUDProvider";
import {QuizPublicationVerificationProvider} from "./QuizPublicationVerificationProvider";

export const QuizPublicationProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuizPublicationCRUDProvider>
            <QuizPublicationVerificationProvider>
                {children}
            </QuizPublicationVerificationProvider>
        </QuizPublicationCRUDProvider>
    );
};