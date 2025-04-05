import React, {useCallback, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {QuizResultHeader} from "../components/quiz-results/QuizResultHeader.tsx";
import {QuizScoreStats} from "../components/quiz-results/QuizScoreStats.tsx";
import {QuestionResultCard} from "../components/quiz-results/QuestionResultCard.tsx";

import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    QuizAttemptDTO,
    QuizPublicationDTO,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal.ts";

const QuizResults: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {resetQuizAttempt} = useQuizAttemptLocal();

    const attempt = location.state?.attempt as QuizAttemptDTO;
    const quizPublication = location.state?.quizPublication as QuizPublicationDTO;

    useEffect(() => {
        if (!attempt || !quizPublication) {
            console.warn('Missing required data in location state');
            navigate('/');
        }
    }, [attempt, quizPublication, navigate]);

    const isResponseCorrect = useCallback((question: QuestionDTO, response: QuestionResponseDTO): boolean => {
        if (question.type === QuestionType.TrueFalse) {
            const trueFalseQuestion = question as TrueFalseQuestionDTO;
            const trueFalseResponse = response as TrueFalseQuestionResponseDTO;
            return trueFalseResponse.selectedAnswer === trueFalseQuestion.correctAnswer;
        }

        if (question.type === QuestionType.MultipleChoice) {
            const multipleChoiceQuestion = question as MultipleChoiceQuestionDTO;
            const multipleChoiceResponse = response as MultipleChoiceQuestionResponseDTO;

            const responseIndexes = multipleChoiceResponse.selectedAnswerIndexes || [];
            const correctIndexes = multipleChoiceQuestion.correctAnswerIndexes || [];

            return JSON.stringify(responseIndexes) === JSON.stringify(correctIndexes);
        }

        return false;
    }, []);

    const calculateScore = useCallback(() => {
        return attempt!.responses!.filter((response: QuestionResponseDTO, index: number) => {
            const question = quizPublication?.questions?.[index];
            return question ? isResponseCorrect(question, response) : false;
        }).length;
    }, [attempt, quizPublication, isResponseCorrect]);

    if (!quizPublication || !attempt) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-4">Loading quiz results...</p>
                </div>
            </div>
        );
    }

    const totalQuestions = quizPublication.questions?.length || 0;
    const score = calculateScore();

    const handleRestart = () => {
        resetQuizAttempt();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
            <div className="container mx-auto px-4">
                <div className="card bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
                    <div className="card-body space-y-8">
                        <QuizResultHeader score={score} totalQuestions={totalQuestions}/>
                        <QuizScoreStats score={score} totalQuestions={totalQuestions}/>

                        <div className="space-y-6">
                            {quizPublication.questions?.map((question, index) => (
                                <QuestionResultCard
                                    key={index}
                                    question={question}
                                    response={attempt!.responses![index]}
                                    index={index}
                                />
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <button
                                onClick={handleRestart}
                                className="btn btn-primary"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;