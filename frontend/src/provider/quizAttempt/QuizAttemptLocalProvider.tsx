import React, {useCallback, useMemo, useState} from 'react';
import {QuestionResponseDTO, QuizAttemptDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {useQuizAttemptCRUD} from '../../hooks/quizAttempt/useQuizAttemptCRUD';
import {useAuth} from '../../hooks/useAuth';
import {QuizAttemptLocalContext} from '../../contexts/quizAttempt/QuizAttemptLocalContext';
import {useNavigate} from "react-router-dom";

export const QuizAttemptLocalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentAttempt, setCurrentAttempt] = useState<Partial<QuizAttemptDTO> | null>(null);
    const {createQuizAttempt} = useQuizAttemptCRUD();
    const {user} = useAuth();
    const navigate = useNavigate();

    const prepareQuizResponses = useCallback((responses: QuestionResponseDTO[]) => {
        setCurrentAttempt(prev => ({
            ...(prev || {}),
            responses: responses
        }));
    }, []);

    const startQuizAttempt = useCallback((publication: QuizPublicationDTO) => {
        const createAttempt = async () => {
            try {
                const newAttempt: QuizAttemptDTO = {
                    quizPublicationId: publication.id,
                    ...(user && !publication.anonymous ? {userId: user.azureOid} : {}),
                    startedAt: new Date().toISOString(),
                    responses: currentAttempt?.responses || [], // Usa le risposte preparate
                } as QuizAttemptDTO;

                const createdAttempt = await createQuizAttempt(newAttempt);
                setCurrentAttempt(createdAttempt);

                return createdAttempt;
            } catch (error) {
                console.error('Errore durante la creazione del tentativo:', error);
                throw error;
            }
        };
        return createAttempt();
    }, [createQuizAttempt, user, currentAttempt]);

    const updateQuizAttemptResponses = useCallback((responses: QuestionResponseDTO[]) => {
        setCurrentAttempt(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                responses: responses
            };
        });
    }, []);

    const completeQuizAttempt = useCallback(async () => {
        if (currentAttempt) {
            try {
                const completedAttempt: QuizAttemptDTO = {
                    ...currentAttempt,
                    completedAt: new Date().toISOString()
                } as QuizAttemptDTO;

                await createQuizAttempt(completedAttempt);

                navigate(`/quiz/results`, {
                    state: {
                        attempt: completedAttempt
                    }
                });

                setCurrentAttempt(null);
            } catch (error) {
                console.error('Errore durante il completamento del tentativo:', error);
                throw error;
            }
        }
    }, [currentAttempt, createQuizAttempt, navigate]);

    const resetQuizAttempt = useCallback(() => {
        setCurrentAttempt(null);
    }, []);

    const value = useMemo(() => ({
        currentAttempt,
        startQuizAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        resetQuizAttempt,
        prepareQuizResponses
    }), [
        currentAttempt,
        startQuizAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        resetQuizAttempt,
        prepareQuizResponses
    ]);

    return (
        <QuizAttemptLocalContext.Provider value={value}>
            {children}
        </QuizAttemptLocalContext.Provider>
    );
};