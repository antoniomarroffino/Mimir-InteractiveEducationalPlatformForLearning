import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetQuizPublicationByCode } from "../../hooks/quizPublication/useGetQuizPublicationByCode.ts";

interface QuizCodeAnalyzerProps {
    publicationCode: string;
    onClose: () => void;
    onError: (message: string) => void;
}

export const QuizCodeAnalyzer: React.FC<QuizCodeAnalyzerProps> = ({
                                                                      publicationCode,
                                                                      onClose,
                                                                      onError
                                                                  }) => {
    const { data: quizPublication, isLoading, error } = useGetQuizPublicationByCode(publicationCode.trim());
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            onError(error.message);
            onClose();
        }
    }, [error, onClose, onError]);

    useEffect(() => {
        if (quizPublication) {
            navigate(`/quiz/${publicationCode}`);
        }
    }, [quizPublication, navigate, publicationCode]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-base-100 p-8 rounded-lg flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-lg">Analyzing code...</p>
                </div>
            </div>
        );
    }

    return null;
};