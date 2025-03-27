import {QuestionDTO, QuestionType} from "@dti-isin/backend-api-client";
import {createContext} from "react";


export type QuestionCRUDContextType = {
    createQuestion: (questionDTO: QuestionDTO & {
        courseId?: string,
        folderId?: string,
        quizId?: string
    }) => Promise<QuestionDTO>;

    updateQuestion: (
        questionId: string,
        questionDTO: QuestionDTO & {
            courseId?: string,
            folderId?: string,
            quizId?: string
        }
    ) => Promise<QuestionDTO>;

    deleteQuestion: (
        questionId: string,
        params?: {
            courseId?: string,
            folderId?: string,
            quizId?: string
        }
    ) => Promise<void>;

    createQuestionTemplate: (questionType: QuestionType) => Promise<QuestionDTO>;

    isCreatingQuestion: boolean;
    isUpdatingQuestion: boolean;
    isDeletingQuestion: boolean;
    isCreatingQuestionTemplate: boolean;

    errorCreateQuestion: Error | null;
    errorUpdateQuestion: Error | null;
    errorDeleteQuestion: Error | null;
    errorCreateQuestionTemplate: Error | null;
}

export const QuestionCRUDContext = createContext<QuestionCRUDContextType | undefined>(undefined);