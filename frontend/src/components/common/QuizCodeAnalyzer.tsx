import React, {useEffect} from 'react';
import {useGetQuizPublicationByCode} from "../../hooks/quizPublication/useGetQuizPublicationByCode.ts";
import {useGetQuizById} from "../../hooks/quiz/useGetQuizById.ts";

interface QuizCodeAnalyzerProps {
    publicationCode: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}

export const QuizCodeAnalyzer: React.FC<QuizCodeAnalyzerProps> = ({
                                                                      publicationCode,
                                                                      onSuccess,
                                                                      onError
                                                                  }) => {
    const {
        data: publication,
        error: pubError,
        isLoading: isLoadingPublication
    } = useGetQuizPublicationByCode(publicationCode.trim());

    const {
        data: quiz,
        error: quizError,
        isLoading: isLoadingQuiz
    } = useGetQuizById(
        publication?.courseId ?? '',
        publication?.folderId ?? '',
        publication?.quizId ?? '',
        {enabled: !!publication}
    );

    useEffect(() => {
        if (pubError) onError(pubError.message);
        if (quizError) onError(quizError.message);
    }, [pubError, quizError, onError]);

    useEffect(() => {
        if (!isLoadingPublication && !isLoadingQuiz && publication && quiz) {
            onSuccess();
        }
    }, [isLoadingPublication, isLoadingQuiz, publication, quiz, onSuccess]);

    return null;
};
