import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal";
import {QuizReview} from "../components/quiz-results/QuizReview.tsx";

const QuizResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {resetQuizAttempt} = useQuizAttemptLocal();

    const attempt = location.state?.attempt;
    const publication = location.state?.quizPublication;

    useEffect(() => {
        if (!attempt || !publication) {
            console.warn('Missing required data in location state');
            navigate('/');
        }
    }, [attempt, publication, navigate]);

    if (!publication || !attempt) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-4">Loading quiz results...</p>
                </div>
            </div>
        );
    }

    const handleClose = () => {
        resetQuizAttempt();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
            <div className="container mx-auto px-4">
                <div className="card bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
                    <div className="card-body">
                        <QuizReview
                            attempt={attempt}
                            publication={publication}
                            onClose={handleClose}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResultsPage;