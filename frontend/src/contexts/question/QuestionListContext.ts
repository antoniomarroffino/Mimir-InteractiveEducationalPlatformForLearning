import {createContext} from "react";
import {QuestionDTO} from "@dti-isin/backend-api-client";

export type QuestionListContextType = {
    questions: QuestionDTO[];
    isLoadingQuestions: boolean;
    errorQuestions: Error | null;
    refetchQuestions: () => Promise<void>;
    getQuestionCount: () => number;
    getQuestionsForQuiz: (
        courseId?: string,
        folderId?: string,
        quizId?: string
    ) => {
        questions: QuestionDTO[];
        isLoadingQuestions: boolean;
        errorQuestions: Error | null;
        refetchQuestions: () => Promise<void>;
    };
};

export const QuestionListContext = createContext<QuestionListContextType | undefined>(undefined);