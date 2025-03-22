import { useContext } from "react";
import {QuizPublicationListContext} from "../contexts/quizPublication/QuizPublicationListContext.ts";

export const useQuizPublicationList = () => {
    const context = useContext(QuizPublicationListContext);
    if (context === undefined) {
        throw new Error('useQuizPublicationList must be used within a QuizPublicationListProvider');
    }
    return context;
};