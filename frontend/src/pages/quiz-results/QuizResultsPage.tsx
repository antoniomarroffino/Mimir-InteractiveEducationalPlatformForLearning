import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useQuizAttemptLocal} from "../../hooks/quizAttempt/useQuizAttemptLocal.ts";
import {QuizReview} from "../../components/quiz-results/QuizReview.tsx";
import {motion} from "framer-motion";
import {QuizResultPageHeader} from "./QuizResultsPageHeader.tsx";

const QuizResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {resetQuizAttempt} = useQuizAttemptLocal();

    const attempt = location.state?.attempt;
    const publication = location.state?.quizPublication;
    const quiz = location.state?.quiz ?? publication?.quiz;

    useEffect(() => {
        if (!attempt || !publication) {
            console.warn('Missing required data in location state');
            navigate('/');
        }
    }, [attempt, publication, navigate]);

    if (!publication || !attempt || !quiz) {
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
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <QuizResultPageHeader
                    quiz={quiz}
                    publication={publication}
                    quizTimeLimit={quiz.timeLimitMinutes}
                />

                <div className="mt-6">
                    <div className="bg-base-100 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6">
                            <QuizReview
                                attempt={attempt}
                                publication={publication}
                                onClose={handleClose}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default QuizResultsPage;