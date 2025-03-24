import {useContext} from "react";
import {QuizListContext} from "../../contexts/quiz/QuizListContext.tsx";

export const useQuizList = () => {
    const context = useContext(QuizListContext);
    if(context === undefined) {
        throw new Error('useQuizList must be used within a QuizListProvider');
    }
    return context;
}