import React, { useCallback, useMemo, useState } from "react";
import {
  MultipleChoiceQuestionResponseDTO,
  QuestionResponseDTO,
  QuestionType,
  QuizAttemptDTO,
  QuizPublicationDTO,
  TrueFalseQuestionResponseDTO,
} from "@dti-isin/backend-api-client";
import { useQuizAttemptCRUD } from "../../hooks/quizAttempt/useQuizAttemptCRUD";
import { useAuth } from "../../hooks/auth/useAuth";
import { QuizAttemptLocalContext } from "../../contexts/quizAttempt/QuizAttemptLocalContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

export const QuizAttemptLocalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentAttempt, setCurrentAttempt] = useState<
    | (Partial<QuizAttemptDTO> & {
        quizPublication?: QuizPublicationDTO;
      })
    | null
  >(null);
  const { createQuizAttempt } = useQuizAttemptCRUD();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const prepareQuizResponses = useCallback(
    (publication: QuizPublicationDTO) => {
      return (
        publication.questions?.map((question) => {
          const baseResponse = {
            questionId: question.id,
            timeSpent: 0,
          };

          switch (question.type) {
            case QuestionType.TrueFalse:
              return {
                ...baseResponse,
                responseType: QuestionType.TrueFalse,
                selectedAnswer: null as unknown as boolean,
              } as TrueFalseQuestionResponseDTO;

            case QuestionType.MultipleChoice:
              return {
                ...baseResponse,
                responseType: QuestionType.MultipleChoice,
                selectedAnswerIndexes: [],
              } as MultipleChoiceQuestionResponseDTO;

            default:
              throw new Error(
                `Tipo di domanda non supportato: ${question.type}`
              );
          }
        }) || []
      );
    },
    []
  );

  const startQuizAttempt = useCallback(
    async (publication: QuizPublicationDTO) => {
      try {
        const responses = prepareQuizResponses(publication);

        setCurrentAttempt({
          quizPublicationId: publication.id,
          quizPublication: publication,
          responses: responses,
          startedAt: new Date().toISOString(),
          user: {
            azureOid: publication.anonymous
              ? undefined
              : user?.azureOid || undefined,
          },
        });

        navigate(`/quiz/${publication.publicationCode}`);
      } catch (error) {
        console.error("Errore durante la preparazione del tentativo:", error);
        throw error;
      }
    },
    [prepareQuizResponses, user, navigate]
  );

  const completeQuizAttempt = useCallback(async (): Promise<QuizAttemptDTO> => {
    if (!currentAttempt) {
      throw new Error("Nessun tentativo di quiz corrente");
    }

    try {
      const completedAttempt: QuizAttemptDTO = {
        quizPublicationId: currentAttempt.quizPublicationId!,
        user: currentAttempt.user,
        startedAt: currentAttempt.startedAt,
        completedAt: new Date().toISOString(),
        responses: currentAttempt.responses || [],
      };

      const completedQuizAttempt = await createQuizAttempt(completedAttempt);
      if (!completedQuizAttempt) {
        console.error("Failed to create quiz attempt");
      }
      await queryClient.invalidateQueries(["quizAttempts"]);
      await queryClient.invalidateQueries([
        "quizAttempts",
        currentAttempt.user?.azureOid,
      ]);

      setCurrentAttempt(null);
      return completedQuizAttempt;
    } catch (error) {
      console.error("Errore durante il completamento del tentativo:", error);
      throw error;
    }
  }, [currentAttempt, createQuizAttempt, queryClient]);

  const updateQuizAttemptResponses = useCallback(
    (responses: QuestionResponseDTO[]) => {
      setCurrentAttempt((prev) => {
        if (!prev || !prev.quizPublication?.questions) return prev;

        const updatedResponses = responses.map((response, index) => {
          const question = prev.quizPublication!.questions![index];

          if (response.responseType === QuestionType.TrueFalse) {
            return {
              ...response,
              questionId: question.id,
              responseType: QuestionType.TrueFalse,
              timeSpent: response.timeSpent || 0,
            } as TrueFalseQuestionResponseDTO;
          } else if (response.responseType === QuestionType.MultipleChoice) {
            return {
              ...response,
              questionId: question.id,
              responseType: QuestionType.MultipleChoice,
              timeSpent: response.timeSpent || 0,
            } as MultipleChoiceQuestionResponseDTO;
          }

          return response;
        });

        return {
          ...prev,
          responses: updatedResponses,
        } as typeof prev;
      });
    },
    []
  );

  const resetQuizAttempt = useCallback(() => {
    setCurrentAttempt(null);
    navigate("/");
  }, [navigate]);

  const value = useMemo(
    () => ({
      currentAttempt,
      startQuizAttempt,
      updateQuizAttemptResponses,
      completeQuizAttempt,
      resetQuizAttempt,
      prepareQuizResponses,
    }),
    [
      currentAttempt,
      startQuizAttempt,
      updateQuizAttemptResponses,
      completeQuizAttempt,
      resetQuizAttempt,
      prepareQuizResponses,
    ]
  );

  return (
    <QuizAttemptLocalContext.Provider value={value}>
      {children}
    </QuizAttemptLocalContext.Provider>
  );
};
