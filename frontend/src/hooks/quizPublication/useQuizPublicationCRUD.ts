import {useContext} from "react";
import {QuizPublicationCRUDContext} from "../../contexts/quizPublication/QuizPublicationCRUDContext.ts";

export const useQuizPublicationCRUD = () => {
    const context = useContext(QuizPublicationCRUDContext);
    if (context === undefined) {
        throw new Error('useQuizPublicationCRUD must be used within a QuizPublicationCRUDProvider');
    }
    return context;
};