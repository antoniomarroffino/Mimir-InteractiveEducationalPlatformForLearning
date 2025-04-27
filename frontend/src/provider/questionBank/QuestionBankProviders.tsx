import {QuestionBankListProvider} from "./QuestionBankListProvider.tsx";
import {QuestionBankCRUDProvider} from "./QuestionBankCRUDProvider.tsx";
import React from "react";

export const QuestionBankProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <QuestionBankListProvider>
            <QuestionBankCRUDProvider>
                {children}
            </QuestionBankCRUDProvider>
        </QuestionBankListProvider>
    );
}