import React, {useCallback, useMemo, useState} from 'react';
import {
    AttemptStatus,
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
import {useQueryClient} from "react-query";

export const QuizAttemptLocalProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentAttempt, setCurrentAttempt] = useState<Partial<QuizAttemptDTO> & {
        quizPublication?: QuizPublicationDTO
    } | null>(null);

    const {createInitialAttempt, submitAttemptFinal} = useQuizAttemptCRUD();
    const {user} = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const prepareQuizResponses = useCallback((publication: QuizPublicationDTO) => {
        return publication.questions?.map(question => {
            const baseResponse = {
                questionId: question.id,
                timeSpent: 0
            };

            switch (question.type) {
                case QuestionType.TrueFalse:
                    return {
                        ...baseResponse,
                        responseType: QuestionType.TrueFalse,
                        selectedAnswer: null as unknown as boolean
                    } as TrueFalseQuestionResponseDTO;

                case QuestionType.MultipleChoice:
                    return {
                        ...baseResponse,
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

            const dto: QuizAttemptDTO = {
                quizPublicationId: publication.id!,
                startedAt: new Date().toISOString(),
                responses: responses,
                status: AttemptStatus.InProgress,
                user: publication.anonymous ? undefined : {
                    azureOid: user?.azureOid
                }
            };

            const createdAttempt = await createInitialAttempt(dto);

            setCurrentAttempt({
                ...createdAttempt,
                quizPublication: publication,
            });

            navigate(`/quiz/${publication.publicationCode}`);
        } catch (error) {
            console.error('Errore durante la creazione del tentativo:', error);
            throw error;
        }
    }, [prepareQuizResponses, user, navigate, createInitialAttempt]);

    const completeQuizAttempt = useCallback(async (
        userResponsesOverride?: QuestionResponseDTO[]
    ): Promise<QuizAttemptDTO> => {
        if (!currentAttempt || !currentAttempt.id) {
            throw new Error('Nessun tentativo di quiz corrente');
        }

        const finalResponses = userResponsesOverride ?? currentAttempt.responses ?? [];

        const completedDTO: QuizAttemptDTO = {
            quizPublicationId: currentAttempt.quizPublicationId!,
            user: currentAttempt.user,
            startedAt: currentAttempt.startedAt,
            completedAt: new Date().toISOString(),
            responses: finalResponses,
            status: AttemptStatus.Terminated
        };

        const submitted = await submitAttemptFinal(currentAttempt.id, completedDTO);

        await queryClient.invalidateQueries(['quizAttempts']);
        if (currentAttempt.user?.azureOid) {
            await queryClient.invalidateQueries(['quizAttempts', currentAttempt.user.azureOid]);
        }

        return submitted;
    }, [currentAttempt, submitAttemptFinal, queryClient]);


    const updateQuizAttemptResponses = useCallback((responses: QuestionResponseDTO[]) => {
        setCurrentAttempt(prev => {
            if (!prev || !prev.quizPublication?.questions) return prev;

            const updatedResponses = responses.map((response, index) => {
                const question = prev.quizPublication!.questions![index];

                if (response.responseType === QuestionType.TrueFalse) {
                    return {
                        ...response,
                        questionId: question.id,
                        responseType: QuestionType.TrueFalse,
                        timeSpent: response.timeSpent || 0
                    } as TrueFalseQuestionResponseDTO;
                } else if (response.responseType === QuestionType.MultipleChoice) {
                    return {
                        ...response,
                        questionId: question.id,
                        responseType: QuestionType.MultipleChoice,
                        timeSpent: response.timeSpent || 0
                    } as MultipleChoiceQuestionResponseDTO;
                }

                return response;
            });

            return {
                ...prev,
                responses: updatedResponses
            } as typeof prev;
        });
    }, []);

    const resetQuizAttempt = useCallback(() => {
        setCurrentAttempt(null);
        navigate('/');
    }, [navigate]);

    const clearQuizAttempt = useCallback(() => {
        setCurrentAttempt(null);
    }, []);

    const resumeAttempt = useCallback((attempt: QuizAttemptDTO, publication: QuizPublicationDTO) => {
        const normalizedAttempt = {
            ...attempt,
            startedAt: new Date(attempt.startedAt!).toISOString(),
            completedAt: attempt.completedAt ? new Date(attempt.completedAt).toISOString() : undefined,
            quizPublication: publication
        };

        setCurrentAttempt(normalizedAttempt);
        updateQuizAttemptResponses(normalizedAttempt.responses || []);
    }, [updateQuizAttemptResponses])

    const value = useMemo(() => ({
        currentAttempt,
        startQuizAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        resetQuizAttempt,
        prepareQuizResponses,
        clearQuizAttempt,
        resumeAttempt
    }), [
        currentAttempt,
        startQuizAttempt,
        updateQuizAttemptResponses,
        completeQuizAttempt,
        resetQuizAttempt,
        prepareQuizResponses,
        clearQuizAttempt,
        resumeAttempt
    ]);

    return (
        <QuizAttemptLocalContext.Provider value={value}>
            {children}
        </QuizAttemptLocalContext.Provider>
    );
};
