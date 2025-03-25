import {QuestionListProvider} from "./QuestionListProvider.tsx";
import {QuestionCRUDProvider} from "./QuestionCRUDProvider.tsx";
import React from "react";
import {QuestionSelectionProvider} from "./QuestionSelectionProvider.tsx";

export const QuestionProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuestionListProvider>
            <QuestionSelectionProvider>
                <QuestionCRUDProvider>
                    {children}
                </QuestionCRUDProvider>
            </QuestionSelectionProvider>
        </QuestionListProvider>
    );
}