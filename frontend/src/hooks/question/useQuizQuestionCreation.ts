import { useState } from 'react';
import {
    QuestionDTO,
    QuestionType,
    TrueFalseQuestionDTO,
    MultipleChoiceQuestionDTO
} from '@dti-isin/backend-api-client';
import { useQuestionCRUD } from "./useQuestionCRUD.ts";

type SpecificQuestionDTO =
    | QuestionDTO
    | TrueFalseQuestionDTO
    | MultipleChoiceQuestionDTO;

export const useQuizQuestionCreation = (
    courseId: string,
    folderId: string,
    quizId: string
) => {
    const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
    const [questionTemplate, setQuestionTemplate] = useState<SpecificQuestionDTO | null>(null);
    const [draftQuestion, setDraftQuestion] = useState<Partial<QuestionDTO>>({});
    const [error, setError] = useState<string | null>(null);
    const [isEditingExistingQuestion, setIsEditingExistingQuestion] = useState(false);

    const { createQuestion, updateQuestion, createQuestionTemplate } = useQuestionCRUD();

    const startQuestionCreation = () => {
        setIsCreatingQuestion(true);
        setIsEditingExistingQuestion(false);
        setDraftQuestion({questionText: ''});
        setSelectedQuestionType(null);
        setQuestionTemplate(null);
    };

    const startQuestionEditing = (question: SpecificQuestionDTO) => {
        setIsCreatingQuestion(true);
        setIsEditingExistingQuestion(true);

        setSelectedQuestionType(question.type);
        setQuestionTemplate(question);

        setDraftQuestion({
            id: question.id,
            questionText: question.questionText,
            type: question.type
        });
    };

    const handleTypeSelection = async (type: QuestionType) => {
        try {
            const template = await createQuestionTemplate(type);

            setSelectedQuestionType(type);
            setQuestionTemplate(template);

            setDraftQuestion(prev => ({
                ...prev,
                type: type
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create question template');
        }
    };

    const handleSaveQuestion = async (questionData: SpecificQuestionDTO) => {
        try {
            setError(null);

            const completeQuestionData = {
                ...questionData,
                courseId,
                folderId,
                quizId
            };

            if (isEditingExistingQuestion && questionData.id) {
                // Aggiornamento di una domanda esistente
                await updateQuestion(questionData.id, completeQuestionData);
            } else {
                // Creazione di una nuova domanda
                await createQuestion(completeQuestionData);
            }

            resetQuestionCreation();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save question');
            console.error(err);
        }
    };

    const resetQuestionCreation = () => {
        setIsCreatingQuestion(false);
        setIsEditingExistingQuestion(false);
        setSelectedQuestionType(null);
        setQuestionTemplate(null);
        setDraftQuestion({});
    };

    return {
        isCreatingQuestion,
        selectedQuestionType,
        questionTemplate,
        draftQuestion,
        error,
        isEditingExistingQuestion,

        startQuestionCreation,
        startQuestionEditing,
        handleTypeSelection,
        handleSaveQuestion,
        setDraftQuestion,
        resetQuestionCreation
    };
};