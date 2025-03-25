import {useContext} from "react";
import {QuizSelectionContext} from "../../contexts/quiz/QuizSelectionContext.tsx";

export const useQuizSelection = () => {
    const context = useContext(QuizSelectionContext);
    if (context === undefined) {
        throw new Error('useQuizSelection must be used within a QuizSelectionProvider');
    }
    return context;
}