import React, {useMemo, useState} from 'react';
import {QuizAttemptDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {useQuizAttemptCRUD} from '../../hooks/quizAttempt/useQuizAttemptCRUD';
import {useAuth} from '../../hooks/useAuth';
import {QuizAttemptLocalContext} from '../../contexts/quizAttempt/QuizAttemptLocalContext';

export const QuizAttemptLocalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentAttempt, setCurrentAttempt] = useState<Partial<QuizAttemptDTO> | null>(null);
    const {createQuizAttempt} = useQuizAttemptCRUD();
    const {user} = useAuth();

    const startQuizAttempt = (publication: QuizPublicationDTO) => {
        const newAttempt: Partial<QuizAttemptDTO> = {
            quizPublicationId: publication.id,
            userId: user!.azureOid,
            startedAt: new Date().toDateString(),
            responses: []
        };
        setCurrentAttempt(newAttempt);
    };

    const updateQuizAttemptResponses = (responses: never[]) => {
        if (currentAttempt) {
            setCurrentAttempt(prev => ({
                ...prev,
                responses: responses
            }));
        }
    };

    const completeQuizAttempt = async () => {
        if (currentAttempt) {
            const completedAttempt: QuizAttemptDTO = {
                ...currentAttempt,
                completedAt: new Date().toDateString()
            } as QuizAttemptDTO;

            try {
                await createQuizAttempt(completedAttempt);
                resetQuizAttempt();
            } catch (error) {
                console.error('Errore durante il salvataggio del tentativo:', error);
            }
        }
    };

    const resetQuizAttempt = () => {
        setCurrentAttempt(null);
    };

    const value = useMemo(() => ({
        currentAttempt,
        startQuizAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        resetQuizAttempt
    }), [currentAttempt]);

    return (
        <QuizAttemptLocalContext.Provider value={value}>
            {children}
        </QuizAttemptLocalContext.Provider>
    );
};