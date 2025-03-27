import {useContext} from "react";
import {QuizRetrieveContext, QuizRetrieveContextType} from "../contexts/QuizRetrieveContext.tsx";

export const useQuizRetrieve = (): QuizRetrieveContextType => {
    const context = useContext(QuizRetrieveContext);

    if (!context) {
        throw new Error("useQuizRetrieve must be used within a QuizRetrieveProvider");
    }

    return context;
};