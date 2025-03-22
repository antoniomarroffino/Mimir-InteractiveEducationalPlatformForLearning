import React from "react";
import { QuizPublicationListProvider } from "./QuizPublicationListProvider";
import { QuizPublicationCRUDProvider } from "./QuizPublicationCRUDProvider";
import { QuizPublicationVerificationProvider } from "./QuizPublicationVerificationProvider";

export const QuizPublicationProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <QuizPublicationListProvider>
            <QuizPublicationCRUDProvider>
                <QuizPublicationVerificationProvider>
                    {children}
                </QuizPublicationVerificationProvider>
            </QuizPublicationCRUDProvider>
        </QuizPublicationListProvider>
    );
};