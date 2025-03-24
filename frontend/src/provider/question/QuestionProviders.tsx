import {QuestionListProvider} from "./QuestionListProvider.tsx";
import {QuestionCRUDProvider} from "./QuestionCRUDProvider.tsx";
import React from "react";

export const QuestionProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <QuestionListProvider>
            <QuestionCRUDProvider>
                {children}
            </QuestionCRUDProvider>
        </QuestionListProvider>
    );
}