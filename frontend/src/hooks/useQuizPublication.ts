import { useContext } from "react";
import { QuizPublicationContext, QuizPublicationContextType } from "../contexts/QuizPublicationContext";

export const useQuizPublication = (): QuizPublicationContextType => {
    const context = useContext(QuizPublicationContext);

    if (!context) {
        throw new Error("useQuizPublication must be used within a QuizPublicationProvider");
    }

    return context;
};