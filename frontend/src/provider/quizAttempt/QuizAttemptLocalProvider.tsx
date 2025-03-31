import React, {useCallback, useMemo, useState} from 'react';
import {
    QuestionResponseDTO,
    QuizDTO,
    QuizAttemptDTO,
    QuizPublicationDTO,
    QuestionType,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import {useQuizAttemptCRUD} from '../../hooks/quizAttempt/useQuizAttemptCRUD';
import {useAuth} from '../../hooks/useAuth';
import {QuizAttemptLocalContext} from '../../contexts/quizAttempt/QuizAttemptLocalContext';
import {useNavigate} from "react-router-dom";

export const QuizAttemptLocalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentAttempt, setCurrentAttempt] = useState<Partial<QuizAttemptDTO> & { quizPublication?: QuizPublicationDTO } | null>(null);
    const {createQuizAttempt} = useQuizAttemptCRUD();
    const {user} = useAuth();
    const navigate = useNavigate();

    const prepareQuizResponses = useCallback((quizToUse: QuizDTO) => {
        console.log('Preparazione risposte per quiz:', quizToUse);

        // Crea la struttura iniziale delle risposte basata sui tipi di domande
        const initialResponses = quizToUse.questions?.map(question => {
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

        console.log('Risposte iniziali:', initialResponses);

        return initialResponses;
    }, []);

    const startQuizAttempt = useCallback(async (publication: QuizPublicationDTO, quiz: QuizDTO) => {
        try {
            // Prepara le risposte localmente
            const responses = prepareQuizResponses(quiz);

            // Aggiorna lo stato del tentativo
            setCurrentAttempt({
                quizPublicationId: publication.id,
                quizPublication: publication,
                responses: responses,
                startedAt: new Date().toISOString(),
                ...(user && !publication.anonymous ? { userId: user.azureOid } : {})
            });

            // Naviga alla pagina del quiz
            navigate(`/quiz/${publication.id}`);

        } catch (error) {
            console.error('Errore durante la preparazione del tentativo:', error);
            throw error;
        }
    }, [prepareQuizResponses, user, navigate]);

    const completeQuizAttempt = useCallback(async () => {
        if (currentAttempt) {
            try {
                const completedAttempt: QuizAttemptDTO = {
                    quizPublicationId: currentAttempt.quizPublicationId!,
                    userId: currentAttempt.userId,
                    startedAt: currentAttempt.startedAt,
                    completedAt: new Date().toISOString(),
                    responses: currentAttempt.responses || [],
                };

                const completedQuizAttempt = await createQuizAttempt(completedAttempt);

                navigate(`/quiz/results`, {
                    state: {
                        attempt: completedQuizAttempt,
                        publication: currentAttempt.quizPublication
                    }
                });

                setCurrentAttempt(null);
            } catch (error) {
                console.error('Errore durante il completamento del tentativo:', error);
                throw error;
            }
        } else {
            console.warn('Nessun tentativo di quiz corrente');
        }
    }, [currentAttempt, createQuizAttempt, navigate]);

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