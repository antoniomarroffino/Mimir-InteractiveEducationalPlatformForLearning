import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    QuestionType,
    QuestionDTO,
    QuestionResponseDTO,
    TrueFalseQuestionDTO,
    MultipleChoiceQuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import {useQuizRetrieve} from "../hooks/useQuizRetrieve.ts";
import {useQuizAttemptLocal} from "../hooks/quizAttempt/useQuizAttemptLocal.ts";
import {QuizResultHeader} from "../components/quiz-results/QuizResultHeader.tsx";
import {QuizScoreStats} from "../components/quiz-results/QuizScoreStats.tsx";
import {QuestionResultCard} from "../components/quiz-results/QuestionResultCard.tsx";

const QuizResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quiz } = useQuizRetrieve();
    const { resetQuizAttempt } = useQuizAttemptLocal();
    const { attempt } = location.state || {};

    React.useEffect(() => {
        if (!attempt) {
            navigate('/');
        }
    }, [quiz, attempt, navigate]);

    const isResponseCorrect = (question: QuestionDTO, response: QuestionResponseDTO): boolean => {
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
    };

    const calculateScore = () => {
        return attempt.responses.filter((response: QuestionResponseDTO, index: number) => {
            const question = quiz?.questions?.[index];
            return question ? isResponseCorrect(question, response) : false;
        }).length;
    };

    // Handle loading case
    if (!quiz || !attempt) {
        return <div>Loading...</div>;
    }

    const totalQuestions = quiz.questions?.length || 0;
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
                        <QuizResultHeader score={score} totalQuestions={totalQuestions} />
                        <QuizScoreStats score={score} totalQuestions={totalQuestions} />

                        <div className="space-y-6">
                            {quiz.questions?.map((question, index) => (
                                <QuestionResultCard
                                    key={index}
                                    question={question}
                                    response={attempt.responses[index]}
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