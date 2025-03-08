import { useState, useCallback, useEffect, useRef } from 'react';
import { QuizDTO } from '@dti-isin/backend-api-client';
import { quizService } from '../../services/quizService';

export const useQuiz = (courseId: string | null, folderId: string | null) => {
    const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    const initialized = useRef(false);

    const fetchQuizzes = useCallback(async () => {
        if (!courseId || !folderId || isLoading) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await quizService.getQuizzesInFolder(courseId, folderId);
            setQuizzes(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error fetching quizzes'));
        } finally {
            setIsLoading(false);
        }
    }, [courseId, folderId, isLoading]);

    const createQuiz = useCallback(async (name: string) => {
        if (!courseId || !folderId || isLoading) return;

        try {
            setIsLoading(true);
            setError(null);
            await quizService.createQuiz(courseId, folderId, { name });
            await fetchQuizzes();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error creating quiz'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [courseId, folderId, fetchQuizzes, isLoading]);

    useEffect(() => {
        let isMounted = true;

        const initializeQuizzes = async () => {
            if (!initialized.current && courseId && folderId) {
                try {
                    await fetchQuizzes();
                    if (isMounted) {
                        initialized.current = true;
                    }
                } catch (error) {
                    console.error('Failed to initialize quizzes:', error);
                }
            }
        };

        initializeQuizzes();

        return () => {
            isMounted = false;
        };
    }, [courseId, folderId, fetchQuizzes]);

    // Reset state when courseId or folderId changes
    useEffect(() => {
        setQuizzes([]);
        setError(null);
        initialized.current = false;
    }, [courseId, folderId]);

    return {
        quizzes,
        isLoading,
        error,
        fetchQuizzes,
        createQuiz,
        selectedQuizId,
        setSelectedQuizId
    };
};