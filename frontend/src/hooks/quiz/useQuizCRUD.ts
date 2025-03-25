import {useContext} from "react";
import {QuizCRUDContext} from "../../contexts/quiz/QuizCRUDContext.tsx";

export const useQuizCRUD = () => {
    const context = useContext(QuizCRUDContext);
    if (context === undefined) {
        throw new Error('useQuizCRUD must be used within a QuizCRUDProvider');
    }
    return context;
};