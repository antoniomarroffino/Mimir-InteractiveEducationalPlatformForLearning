import React, {useCallback, useMemo, useState} from 'react';
import {
    MultipleChoiceQuestionResponseDTO,
    QuestionResponseDTO,
    QuestionType,
    QuizAttemptDTO,
    QuizPublicationDTO,
    TrueFalseQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import {useQuizAttemptCRUD} from '../../hooks/quizAttempt/useQuizAttemptCRUD';
import {useAuth} from '../../hooks/useAuth';
import {QuizAttemptLocalContext} from '../../contexts/quizAttempt/QuizAttemptLocalContext';
import {useNavigate} from "react-router-dom";

export const QuizAttemptLocalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentAttempt, setCurrentAttempt] = useState<Partial<QuizAttemptDTO> & {
        quizPublication?: QuizPublicationDTO
    } | null>(null);
    const {createQuizAttempt} = useQuizAttemptCRUD();
    const {user} = useAuth();
    const navigate = useNavigate();

    const prepareQuizResponses = useCallback((publication: QuizPublicationDTO) => {

        return publication.questions?.map(question => {
            switch (question.type) {
                case QuestionType.TrueFalse:
                    return {
                        responseType: QuestionType.TrueFalse,
                        selectedAnswer: null as unknown as boolean
                    } as TrueFalseQuestionResponseDTO;

                case QuestionType.MultipleChoice:
                    return {
                        responseType: QuestionType.MultipleChoice,
                        selectedAnswerIndexes: []
                    } as MultipleChoiceQuestionResponseDTO;

                default:
                    throw new Error(`Tipo di domanda non supportato: ${question.type}`);
            }
        }) || [];
    }, []);

    const startQuizAttempt = useCallback(async (publication: QuizPublicationDTO) => {
        try {
            const responses = prepareQuizResponses(publication);

            setCurrentAttempt({
                quizPublicationId: publication.id,
                quizPublication: publication,
                responses: responses,
                startedAt: new Date().toISOString(),
                ...(user && !publication.anonymous ? {userId: user.azureOid} : {})
            });

            navigate(`/quiz/${publication.publicationCode}`);

        } catch (error) {
            console.error('Errore durante la preparazione del tentativo:', error);
            throw error;
        }
    }, [prepareQuizResponses, user, navigate]);

    const completeQuizAttempt = useCallback(async (): Promise<QuizAttemptDTO> => {
        if (!currentAttempt) {
            throw new Error('Nessun tentativo di quiz corrente');
        }

        try {
            const completedAttempt: QuizAttemptDTO = {
                quizPublicationId: currentAttempt.quizPublicationId!,
                userAzureOID: currentAttempt.userAzureOID,
                startedAt: currentAttempt.startedAt,
                completedAt: new Date().toISOString(),
                responses: currentAttempt.responses || [],
            };

            const completedQuizAttempt = await createQuizAttempt(completedAttempt);
            if (!completedQuizAttempt) {
                throw new Error('Failed to create quiz attempt');
            }

            setCurrentAttempt(null);
            return completedQuizAttempt;
        } catch (error) {
            console.error('Errore durante il completamento del tentativo:', error);
            throw error;
        }
    }, [currentAttempt, createQuizAttempt]);

    const updateQuizAttemptResponses = useCallback((responses: QuestionResponseDTO[]) => {
        setCurrentAttempt(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                responses: responses
            };
        });
    }, []);

    const resetQuizAttempt = useCallback(() => {
        setCurrentAttempt(null);
        navigate('/');
    }, [navigate]);

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