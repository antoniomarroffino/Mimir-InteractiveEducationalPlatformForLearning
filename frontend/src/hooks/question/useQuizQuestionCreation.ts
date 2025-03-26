import { useState } from 'react';
import { QuestionDTO, QuestionType } from '@dti-isin/backend-api-client';
import {useQuestionCRUD} from "./useQuestionCRUD.ts";

export const useQuizQuestionCreation = (
    courseId: string,
    folderId: string,
    quizId: string
) => {
    const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
    const [questionTemplate, setQuestionTemplate] = useState<QuestionDTO | null>(null);
    const [draftQuestion, setDraftQuestion] = useState<Partial<QuestionDTO>>({});
    const [error, setError] = useState<string | null>(null);

    const { createQuestion, createQuestionTemplate } = useQuestionCRUD();

    const startQuestionCreation = () => {
        setIsCreatingQuestion(true);
        setDraftQuestion({questionText: ''});
        // Reset altri stati
        setSelectedQuestionType(null);
        setQuestionTemplate(null);
    };

    const handleTypeSelection = async (type: QuestionType) => {
        try {
            // Crea un template per il tipo di domanda selezionato
            const template = await createQuestionTemplate(type);

            // Imposta il tipo e il template
            setSelectedQuestionType(type);
            setQuestionTemplate(template);

            // Aggiorna la bozza della domanda con il tipo
            setDraftQuestion(prev => ({
                ...prev,
                type: type
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create question template');
            console.error(err);
        }
    };

    const handleSaveQuestion = async (questionData: QuestionDTO) => {
        try {
            // Resetta eventuali errori precedenti
            setError(null);

            // Salva la domanda con i dettagli del corso, cartella e quiz
            await createQuestion({
                ...questionData,
                courseId,
                folderId,
                quizId
            });

            // Resetta tutti gli stati dopo il salvataggio
            resetQuestionCreation();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save question');
            console.error(err);
        }
    };

    const resetQuestionCreation = () => {
        setIsCreatingQuestion(false);
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

        startQuestionCreation,
        handleTypeSelection,
        handleSaveQuestion,
        setDraftQuestion,
        resetQuestionCreation
    };
};