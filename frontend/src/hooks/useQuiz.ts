import {QuizContext} from "../contexts/QuizContext.tsx";
import {useContext} from "react";

export const useQuiz = () => {
    const context = useContext(QuizContext);

    if (context === undefined) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }

    return context;
};