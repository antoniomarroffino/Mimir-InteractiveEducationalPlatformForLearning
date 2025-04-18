import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QuizQuestions } from "../components/common/QuizQuestions";
import { QuizDTO, QuizPublicationDTO } from "@dti-isin/backend-api-client";
import {QuizExecutionHeader} from "../components/quiz/QuizExecutionHeader.tsx";

const QuizQuestionsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCode } = useParams();

    const state = location.state as {
        publication?: QuizPublicationDTO;
        quiz?: QuizDTO;
    };

    if (!state?.publication || !state?.quiz) {
        navigate(`/quiz/${accessCode}`);
        return null;
    }

    return (
        <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-base-200 to-base-300">
            <QuizExecutionHeader
                title={state.quiz?.name ?? ''}
                description={state.quiz?.description ?? ''}
            />
            <QuizQuestions
                publication={state.publication}
                timeLimit={state.quiz.timeLimitMinutes}
            />
        </div>
    );
};

export default QuizQuestionsPage;
