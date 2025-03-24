import {QuestionDTO, QuestionType} from "@dti-isin/backend-api-client";
import {createContext} from "react";


export type QuestionCRUDContextType = {
    createQuestion: (courseId:string, folderId: string, quizId: string, questionDTO: QuestionDTO) => Promise<QuestionDTO>;
    updateQuestion: (courseId:string, folderId: string, quizId: string, questionId: string, data: QuestionDTO) => Promise<QuestionDTO>;
    deleteQuestion: (courseId:string, folderId: string, quizId: string, questionId: string) => Promise<void>;
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