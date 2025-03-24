import { QuizDTO } from "@dti-isin/backend-api-client/dist/models/quiz-dto";
import {createContext} from "react";

export type QuizListContextType = {
    quizzes: QuizDTO[];

    isLoadingQuizzes: boolean;

    errorQuizzes: Error | null;

    fetchQuizzes: () => Promise<void>;
}

export const QuizListContext = createContext<QuizListContextType | undefined>(undefined);