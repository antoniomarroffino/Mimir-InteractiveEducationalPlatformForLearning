import React, {useCallback, useMemo, useState} from 'react';
import {
    MultipleChoiceQuestionResponseDTO,
    QuestionResponseDTO,
    QuestionType,
    QuizAttemptDTO,
    QuizDTO,
    QuizPublicationDTO,
    TrueFalseQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import {useQuizAttemptCRUD} from '../../hooks/quizAttempt/useQuizAttemptCRUD';
import {useAuth} from '../../hooks/useAuth';
import {QuizAttemptLocalContext} from '../../contexts/quizAttempt/QuizAttemptLocalContext';
import {useNavigate} from "react-router-dom";
import {useQuizRetrieve} from "../../hooks/useQuizRetrieve.ts";

export const QuizAttemptLocalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentAttempt, setCurrentAttempt] = useState<Partial<QuizAttemptDTO> | null>(null);
    const {createQuizAttempt} = useQuizAttemptCRUD();
    const {retrieveQuiz, resetQuiz, quiz: retrievedQuiz} = useQuizRetrieve();
    const {user} = useAuth();
    const navigate = useNavigate();

    const prepareQuizResponses = useCallback((quizToUse: QuizDTO) => {
        console.log('Preparazione risposte per quiz:', quizToUse);

        // Crea la struttura iniziale delle risposte basata sui tipi di domande
        const initialResponses = quizToUse.questions?.map(question => {
            switch (question.type) {
                case QuestionType.TrueFalse:
                    return {
                        type: QuestionType.TrueFalse,
                        selectedAnswer: null as unknown as boolean
                    } as TrueFalseQuestionResponseDTO;

                case QuestionType.MultipleChoice:
                    return {
                        type: QuestionType.MultipleChoice,
                        selectedAnswerIndexes: []
                    } as MultipleChoiceQuestionResponseDTO;

                default:
                    throw new Error(`Tipo di domanda non supportato: ${question.type}`);
            }
        }) || [];

        console.log('Risposte iniziali:', initialResponses);

        // Aggiorna lo stato del tentativo con le risposte iniziali
        setCurrentAttempt(prev => ({
            ...(prev || {}),
            quizPublicationId: quizToUse.id,
            responses: initialResponses,
            startedAt: new Date().toISOString(),
            ...(user ? {userId: user.azureOid} : {})
        }));

        return initialResponses;
    }, [user]);

    const startQuizAttempt = useCallback(async (publication: QuizPublicationDTO) => {
        try {
            // Recupera il quiz
            await retrieveQuiz(publication);

            // Usa il quiz recuperato
            const quizToUse = retrievedQuiz;

            if (!quizToUse) {
                throw new Error('Impossibile recuperare il quiz');
            }

            // Prepara le risposte localmente
            prepareQuizResponses(quizToUse);

            // Naviga alla pagina del quiz
            navigate(`/quiz/${publication.id}`);

        } catch (error) {
            console.error('Errore durante la preparazione del tentativo:', error);
            throw error;
        }
    }, [retrieveQuiz, prepareQuizResponses, navigate]);

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

                // Invia l'attempt completato al backend
                const completedQuizAttempt = await createQuizAttempt(completedAttempt);

                navigate(`/quiz/results`, {
                    state: {
                        attempt: completedQuizAttempt
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
        if (resetQuiz) {
            resetQuiz();
        }
        navigate('/');
    }, [resetQuiz, navigate]);

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