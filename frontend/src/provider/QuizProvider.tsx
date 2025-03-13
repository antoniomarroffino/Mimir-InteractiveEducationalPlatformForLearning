import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { QuizContext } from "../contexts/QuizContext";
import { QuizDTO } from "@dti-isin/backend-api-client";
import { quizApi } from "../../config/config";
import { useCourse } from "../hooks/useCourse";

export const QuizProvider: React.FC<{
    children: React.ReactNode;
    folderId: string
}> = ({ children, folderId }) => {
    const queryClient = useQueryClient();
    const { selectedCourseId } = useCourse();
    const [selectedQuizId, setSelectedQuizId] = React.useState<string | null>(null);

    const { data: quizzes = [], isLoading, error } = useQuery<QuizDTO[], Error>({
        queryKey: ["quizzes", selectedCourseId, folderId],
        queryFn: async () => {
            if (!selectedCourseId || !folderId) return [];
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId: selectedCourseId,
                folderId: folderId
            });
            return response.data;
        },
        enabled: !!selectedCourseId && !!folderId,
    });

    const createQuizMutation = useMutation<QuizDTO, Error, string>({
        mutationFn: async (name) => {
            if (!selectedCourseId || !folderId) throw new Error("Missing course or folder");
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId: selectedCourseId,
                folderId: folderId,
                quizDTO: { name } as QuizDTO
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["quizzes", selectedCourseId, folderId]);
        },
    });

    const deleteQuizMutation = useMutation<void, Error, string>({
        mutationFn: async (quizId) => {
            if (!selectedCourseId || !folderId) throw new Error("Missing course or folder");
            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId: selectedCourseId,
                folderId: folderId,
                quizId: quizId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["quizzes", selectedCourseId, folderId]);
        },
    });

    const updateQuizMutation = useMutation<QuizDTO, Error, { quizId: string; data: QuizDTO }>({
        mutationFn: async ({ quizId, data }) => {
            if (!selectedCourseId || !folderId) throw new Error("Missing course or folder");
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut({
                courseId: selectedCourseId,
                folderId: folderId,
                quizId: quizId,
                quizDTO: data
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["quizzes", selectedCourseId, folderId]);
        },
    });

    const createQuiz = async (name: string) => {
        await createQuizMutation.mutateAsync(name);
    };

    const deleteQuiz = async (quizId: string) => {
        await deleteQuizMutation.mutateAsync(quizId);
    };

    const updateQuiz = async (quizId: string, data: QuizDTO) => { // Modifica il tipo qui
        await updateQuizMutation.mutateAsync({ quizId, data });
    };

    const fetchQuizzes = async () => {
        await queryClient.invalidateQueries(["quizzes", selectedCourseId, folderId]);
    };

    return (
        <QuizContext.Provider
            value={{
                quizzes,
                isLoading: isLoading ||
                    createQuizMutation.isLoading ||
                    deleteQuizMutation.isLoading ||
                    updateQuizMutation.isLoading,
                error: error ??
                    createQuizMutation.error ??
                    deleteQuizMutation.error ??
                    updateQuizMutation.error ??
                    null,
                createQuiz,
                deleteQuiz,
                updateQuiz,
                selectedQuizId,
                setSelectedQuizId,
                fetchQuizzes,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};