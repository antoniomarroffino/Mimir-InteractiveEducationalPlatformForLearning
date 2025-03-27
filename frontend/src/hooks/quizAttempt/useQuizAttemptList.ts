import {useContext} from "react";
import {QuizAttemptListContext} from "../../contexts/quizAttempt/QuizAttemptListContext.ts";

export const useQuizAttemptList = () => {
    const context = useContext(QuizAttemptListContext);
    if (context === undefined) {
        throw new Error("useQuizAttemptList must be used within a QuizAttemptListProvider");
    }
    return context;
};