import React from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetQuizPublicationByCode } from "../hooks/quizPublication/useGetQuizPublicationByCode.ts";
import { useGetQuizById } from "../hooks/quiz/useGetQuizById.ts";
import { QuizDTO, QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import QuizPreStart from "../components/quiz/QuizPreStart.tsx";

const QuizScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCode } = useParams();

    const state = location.state as {
        publication?: QuizPublicationDTO;
        quiz?: QuizDTO;
    };

    const hasStateData = !!(state?.publication && state?.quiz);

    const {
        data: publication,
        isLoading: isLoadingPublication,
        error: errorPublication
    } = useGetQuizPublicationByCode(accessCode!, {
        enabled: !hasStateData
    });

    const {
        data: quiz,
        isLoading: isLoadingQuiz,
        error: errorQuiz
    } = useGetQuizById(
        publication?.courseId ?? '',
        publication?.folderId ?? '',
        publication?.quizId ?? '',
        { enabled: !hasStateData && !!publication }
    );

    if (hasStateData) {
        return <QuizPreStart />;
    }

    if (errorPublication || errorQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="alert alert-error shadow-lg">
                    <span>Errore nel caricamento del quiz.</span>
                    <button className="btn btn-sm ml-4" onClick={() => navigate('/')}>
                        Torna alla home
                    </button>
                </div>
            </div>
        );
    }

    if (publication && quiz && !isLoadingPublication && !isLoadingQuiz) {
        navigate(`/quiz/${accessCode}`, {
            replace: true,
            state: { publication, quiz }
        });
        return null;
    }

    return <LoadingSpinner />;
};

export default QuizScreen;
