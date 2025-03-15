import React, {useMemo} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {QuizContext} from "../contexts/QuizContext";
import {QuizDTO} from "@dti-isin/backend-api-client";
import {quizApi} from "../../config/config";
import {useCourse} from "../hooks/useCourse";
import {useFolder} from "../hooks/useFolder";

interface QuizProviderProps {
    children: React.ReactNode;
    courseId?: string;
    folderId?: string;
}

export const QuizProvider: React.FC<QuizProviderProps> = React.memo(({
                                                                         children,
                                                                         courseId: propCourseId,
                                                                         folderId: propFolderId
                                                                     }) => {
    const queryClient = useQueryClient();
    const { selectedCourseId: contextCourseId } = useCourse();
    const { selectedFolderId: contextFolderId } = useFolder();

    // Usa useMemo per stabilizzare i valori
    const courseId = useMemo(() => propCourseId || contextCourseId, [propCourseId, contextCourseId]);
    const folderId = useMemo(() => propFolderId || contextFolderId, [propFolderId, contextFolderId]);

    const [selectedQuizId, setSelectedQuizId] = React.useState<string | null>(null);

    // Query per i quiz
    const {
        data: quizzes = [],
        isLoading: isLoadingQuizzes,
        error: errorQuizzes,
        refetch: refetchQuizzes,
    } = useQuery<QuizDTO[], Error>({
        queryKey: ["quizzes", courseId, folderId],
        queryFn: async () => {
            if (!courseId || !folderId) return [];
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId,
                folderId
            });
            return response.data;
        },
        enabled: !!courseId && !!folderId,
        staleTime: 1000 * 60, // 1 minuto
        cacheTime: 1000 * 60 * 5 // 5 minuti
    });

    const createQuizMutation = useMutation<QuizDTO, Error, string>({
        mutationFn: async (name: string) => {
            if (!courseId || !folderId) {
                throw new Error("No course or folder selected");
            }
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId,
                folderId,
                quizDTO: { name }
            });
            return response.data;
        },
        onSuccess: (newQuiz) => {
            queryClient.setQueryData(
                ["quizzes", courseId, folderId],
                (oldData: QuizDTO[] | undefined) => {
                    return oldData ? [...oldData, newQuiz] : [newQuiz];
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["quizzes", courseId, folderId],
            });
        },
    });

    const deleteQuizMutation = useMutation<void, Error, string>({
        mutationFn: async (quizId: string) => {
            if (!courseId || !folderId) {
                throw new Error("No course or folder selected");
            }
            await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete({
                courseId,
                folderId,
                quizId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes", courseId, folderId],
            });
        },
    });

    const createQuiz = async (name: string): Promise<QuizDTO> => {
        try {
            return await createQuizMutation.mutateAsync(name);
        } catch (err) {
            console.error("Quiz creation failed:", err);
            throw err;
        }
    };
    const deleteQuiz = async (quizId: string) => {
        try {
            await deleteQuizMutation.mutateAsync(quizId);
        } catch (err) {
            console.error("Quiz deletion failed:", err);
            throw err;
        }
    };

    const fetchQuizzes = async () => {
        await refetchQuizzes();
    };

    // Memoizza il valore del contesto
    const value = useMemo(() => ({
        quizzes,
        isLoadingQuizzes,
        errorQuizzes,
        selectedQuizId,
        setSelectedQuizId,
        createQuiz,
        fetchQuizzes,
        isCreatingQuiz: createQuizMutation.isLoading,
        errorCreateQuiz: createQuizMutation.error,
        deleteQuiz,
        isDeletingQuiz: deleteQuizMutation.isLoading,
        errorDeleteQuiz: deleteQuizMutation.error
    }), [
        quizzes,
        isLoadingQuizzes,
        errorQuizzes,
        selectedQuizId,
        createQuizMutation.isLoading,
        createQuizMutation.error,
        deleteQuizMutation.isLoading,
        deleteQuizMutation.error
    ]);

    return (
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    );
});