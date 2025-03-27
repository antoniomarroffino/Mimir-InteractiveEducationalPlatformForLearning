import {useContext} from "react";
import {QuizPublicationVerificationContext} from "../../contexts/quizPublication/QuizPublicationVerificationContext.ts";

export const useQuizPublicationVerification = () => {
    const context = useContext(QuizPublicationVerificationContext);
    if (context === undefined) {
        throw new Error('useQuizPublicationVerification must be used within a QuizPublicationVerificationProvider');
    }
    return context;
};