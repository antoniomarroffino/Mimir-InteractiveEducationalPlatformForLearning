import { useQuizContext } from "../contexts/QuizContext";

export const useQuiz = () => {
    return useQuizContext();
};