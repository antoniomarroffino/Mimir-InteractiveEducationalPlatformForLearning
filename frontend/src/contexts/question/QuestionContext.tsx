import {createContext} from 'react';
import {QuestionDTO, QuestionType} from '../backend/target/backend-api-client/index.ts';

export type QuestionContextType = {
    questions: QuestionDTO[];
    isLoadingQuestions: boolean;
    errorQuestions: Error | null;
    selectedQuestionId: string | null;
    setSelectedQuestionId: (id: string | null) => void;
    createQuestionTemplate: (type?: QuestionType) => Promise<QuestionDTO>;
    addQuestionToQuiz: (questionDTO: QuestionDTO) => Promise<QuestionDTO>;
    fetchQuestions: () => Promise<void>;
    isCreatingQuestion: boolean;
    errorCreateQuestion: Error | null;
};

export const QuestionContext = createContext<QuestionContextType | undefined>(undefined);