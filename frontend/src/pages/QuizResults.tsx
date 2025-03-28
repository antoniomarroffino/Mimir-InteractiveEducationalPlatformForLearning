// QuizResults.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    QuizDTO,
    QuestionResponseDTO,
    QuestionType,
    QuestionDTO,
    TrueFalseQuestionDTO,
    MultipleChoiceQuestionDTO,
    TrueFalseResponseDTO,
    MultipleChoiceResponseDTO
} from '@dti-isin/backend-api-client';

const QuizResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [responses, setResponses] = useState<QuestionResponseDTO[]>([]);

    useEffect(() => {
        const quizFromState = location.state?.quiz as QuizDTO;
        const responsesFromState = location.state?.attempt?.responses as QuestionResponseDTO[];

        if (!quizFromState || !responsesFromState) {
            navigate('/');
            return;
        }

        setQuiz(quizFromState);
        setResponses(responsesFromState);
    }, [location.state, navigate]);

    const isResponseCorrect = (question: QuestionDTO, response: QuestionResponseDTO): boolean => {
        if (question.type === QuestionType.TrueFalse) {
            const trueFalseQuestion = question as TrueFalseQuestionDTO;
            const trueFalseResponse = response as TrueFalseResponseDTO;
            return trueFalseResponse.selectedAnswer === trueFalseQuestion.correctAnswer;
        }

        if (question.type === QuestionType.MultipleChoice) {
            const multipleChoiceQuestion = question as MultipleChoiceQuestionDTO;
            const multipleChoiceResponse = response as MultipleChoiceResponseDTO;
            return JSON.stringify(multipleChoiceResponse.selectedAnswerIndexes) ===
                JSON.stringify(multipleChoiceQuestion.correctAnswerIndexes);
        }

        return false;
    };

    const calculateScore = () => {
        return responses.filter((response, index) => {
            const question = quiz?.questions?.[index];
            return question ? isResponseCorrect(question, response) : false;
        }).length;
    };

    if (!quiz || !responses) {
        return <div>Caricamento...</div>;
    }

    return (
        <div className="min-h-screen bg-base-200 py-12">
            <div className="container mx-auto px-4">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-3xl text-primary mb-6">
                            Risultati del Quiz
                        </h2>

                        <div className="stats shadow mb-6">
                            <div className="stat">
                                <div className="stat-title">Punteggio</div>
                                <div className="stat-value text-primary">
                                    {calculateScore()} / {quiz.questions?.length || 0}
                                </div>
                                <div className="stat-desc">
                                    {Math.round((calculateScore() / (quiz.questions?.length || 1)) * 100)}%
                                    risposte corrette
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {quiz.questions?.map((question, index) => {
                                const response = responses[index];
                                const isCorrect = isResponseCorrect(question, response);

                                return (
                                    <div
                                        key={index}
                                        className={`card ${isCorrect ? 'bg-success/10' : 'bg-error/10'} shadow-sm`}
                                    >
                                        <div className="card-body">
                                            <h3 className="card-title text-xl">
                                                Domanda {index + 1}: {question.questionText}
                                            </h3>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold mb-2">La tua risposta:</div>
                                                    {/* Rendering della risposta dell'utente */}
                                                    {/* Aggiungi qui la logica per mostrare la risposta specifica */}
                                                </div>

                                                <div>
                                                    <div className="font-bold mb-2">Risposta corretta:</div>
                                                    {/* Rendering della risposta corretta */}
                                                    {/* Aggiungi qui la logica per mostrare la risposta corretta */}
                                                </div>
                                            </div>

                                            {!isCorrect && (
                                                <div className="alert alert-error shadow-lg mt-4">
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span>Risposta errata</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;