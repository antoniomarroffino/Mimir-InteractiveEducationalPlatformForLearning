import { useContext } from "react";
import {QuizAttemptCRUDContext} from "../../contexts/quizAttempt/QuizAttemptCRUDContext.ts";
export const useQuizAttemptCRUD = () => {
    const context = useContext(QuizAttemptCRUDContext);
    if (context === undefined) {
        throw new Error("useQuizAttemptCRUD must be used within a QuizAttemptCRUDProvider");
    }
    return context;
};
