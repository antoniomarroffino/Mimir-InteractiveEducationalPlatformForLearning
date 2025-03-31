import {QuestionCRUDProvider} from "./QuestionCRUDProvider.tsx";
import React from "react";

export const QuestionProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuestionCRUDProvider>
            {children}
        </QuestionCRUDProvider>
    );
}