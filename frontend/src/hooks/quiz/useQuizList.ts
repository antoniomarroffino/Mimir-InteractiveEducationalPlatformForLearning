import {useContext} from "react";
import {QuizListContext} from "../../contexts/quiz/QuizListContext.tsx";
import {useQuizzesForFolder} from "./useQuizzesForFolder.ts";

export const useQuizList = () => {
    const context = useContext(QuizListContext);
    if(context === undefined) {
        throw new Error('useQuizList must be used within a QuizListProvider');
    }

    return {
        ...context,
        getQuizzesForFolder: (folderId: string) => {
            // Usa il nuovo hook qui
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const quizzesQuery = useQuizzesForFolder(folderId);

            return {
                quizzes: quizzesQuery.data || [],
                isLoadingQuizzes: quizzesQuery.isLoading,
                errorQuizzes: quizzesQuery.error,
                refetchQuizzes: quizzesQuery.refetch
            };
        }
    };
};