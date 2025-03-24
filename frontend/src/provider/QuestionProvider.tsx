import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { QuestionContext } from "../contexts/QuestionContext";
import { QuestionDTO, QuestionType } from "@dti-isin/backend-api-client";
import { questionApi } from "../../config/config";
import { useFolder } from "../hooks/useFolder";
import {useCourseSelection} from "../hooks/course/useCourseSelection.ts";

interface QuestionProviderProps {
    children: React.ReactNode;
    courseId?: string;
    folderId?: string;
    quizId?: string;
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({
                                                                      children,
                                                                      courseId: propCourseId,
                                                                      folderId: propFolderId,
                                                                      quizId: propQuizId
                                                                  }) => {
    const queryClient = useQueryClient();
    const { selectedCourseId: contextCourseId } = useCourseSelection();
    const { selectedFolderId: contextFolderId } = useFolder();

    const courseId = propCourseId || contextCourseId;
    const folderId = propFolderId || contextFolderId;
    const quizId = propQuizId;

    const [selectedQuestionId, setSelectedQuestionId] = React.useState<string | null>(null);

    // Query per le domande
    const {
        data: questions = [],
        isLoading: isLoadingQuestions,
        error: errorQuestions,
        refetch: refetchQuestions,
    } = useQuery<QuestionDTO[], Error>({
        queryKey: ["questions", courseId, folderId, quizId],
        queryFn: async () => {
            if (!courseId || !folderId || !quizId) return [];
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId,
                folderId,
                quizId
            });
            return response.data;
        },
        enabled: !!courseId && !!folderId && !!quizId,
        staleTime: 0,
        cacheTime: 1000 * 60 * 5
    });

    // Mutation per creare un template di domanda
    const createQuestionTemplateMutation = useMutation<QuestionDTO, Error, QuestionType | undefined>({
        mutationFn: async (type) => {
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsTypePost({
                type
            });
            return response.data;
        }
    });

    // Mutation per aggiungere una domanda al quiz
    const addQuestionToQuizMutation = useMutation<QuestionDTO, Error, QuestionDTO>({
        mutationFn: async (questionDTO) => {
            if (!courseId || !folderId || !quizId) {
                throw new Error("No course, folder, or quiz selected");
            }
            console.log(questionDTO);
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsPost({
                courseId,
                folderId,
                quizId,
                questionDTO
            });
            return response.data;
        },
        onSuccess: (newQuestion) => {
            queryClient.setQueryData(
                ["questions", courseId, folderId, quizId],
                (oldData: QuestionDTO[] | undefined) => {
                    return oldData ? [...oldData, newQuestion] : [newQuestion];
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["questions", courseId, folderId, quizId],
            });
        }
    });

    const createQuestionTemplate = async (type?: QuestionType): Promise<QuestionDTO> => {
        try {
            return await createQuestionTemplateMutation.mutateAsync(type);
        } catch (err) {
            console.error("Question template creation failed:", err);
            throw err;
        }
    };

    const addQuestionToQuiz = async (questionDTO: QuestionDTO): Promise<QuestionDTO> => {
        try {
            return await addQuestionToQuizMutation.mutateAsync(questionDTO);
        } catch (err) {
            console.error("Adding question to quiz failed:", err);
            throw err;
        }
    };

    const fetchQuestions = async () => {
        await refetchQuestions();
    };

    const value = useMemo(() => ({
        questions,
        isLoadingQuestions,
        errorQuestions,
        selectedQuestionId,
        setSelectedQuestionId,
        createQuestionTemplate,
        addQuestionToQuiz,
        fetchQuestions,
        isCreatingQuestion: createQuestionTemplateMutation.isLoading,
        errorCreateQuestion: createQuestionTemplateMutation.error
    }), [
        questions,
        isLoadingQuestions,
        errorQuestions,
        selectedQuestionId,
        createQuestionTemplateMutation.isLoading,
        createQuestionTemplateMutation.error
    ]);

    return (
        <QuestionContext.Provider value={value}>
            {children}
        </QuestionContext.Provider>
    );
};