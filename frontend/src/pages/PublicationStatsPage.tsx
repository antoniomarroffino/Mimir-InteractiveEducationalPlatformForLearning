import React, { useState, useEffect, useMemo } from 'react';
import {
    QuestionType,
    QuizPublicationDTO,
    QuizAttemptDTO,
    TrueFalseQuestionDTO,
    MultipleChoiceQuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import { useParams } from "react-router-dom";
import { PublicationDetails } from "../components/quizPublication/PublicationDetails.tsx";
import { motion } from 'framer-motion';
import { useGetQuizPublicationsByQuizId } from "../hooks/quizPublication/useGetQuizPublicationsByQuizId.ts";
import NoPublicationsPlaceholder from "../components/quizPublication/NoPublicationsPlaceholder.tsx";
import {useGetQuizAttemptsByPublication} from "../hooks/quizAttempt/useGetQuizAttemptsByPublication.ts";
import {QuestionStatistics} from "../components/publication-stats/QuestionStatistics.tsx";
import {AttemptsTable} from "../components/publication-stats/AttemptsTable.tsx";
import {AttemptDetails} from "../components/publication-stats/AttemptDetails.tsx";
import {PublicationSelector} from "../components/publication-stats/PublicationSelector.tsx";

const PublicationStatsPage: React.FC = () => {
    const { quizId } = useParams();
    const { data: publications, isLoading: isGettingPublicationsByQuizId } = useGetQuizPublicationsByQuizId(quizId!);
    const [selectedPublication, setSelectedPublication] = useState<QuizPublicationDTO | null>(null);
    const {
        data: attempts,
        isLoading: isLoadingAttempts,
        isFetching,
        refetch
    } = useGetQuizAttemptsByPublication(selectedPublication?.id || '');
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptDTO | null>(null);
    useEffect(() => {
        if (publications) {
            const activePublication = publications
                .filter(pub => pub.published)
                .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];

            const selectedPub = activePublication ||
                publications.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
            setSelectedPublication(selectedPub);
        }
    }, [publications]);

    useEffect(() => {
        if (attempts && attempts.length > 0) {
            setSelectedAttempt(attempts[0]);
        }
    }, [attempts]);

    const questionStats = useMemo(() => {
        if (!attempts || !selectedPublication?.questions) return null;

        return selectedPublication.questions.map(question => {
            // Aggiungi controlli null-safe
            const responses = attempts.flatMap(attempt =>
                (attempt.responses || []).filter(response =>
                    response.questionId === question.id
                )
            );

            const totalResponses = responses.length;
            const correctResponses = responses.filter(response => {
                if (!response || !question) return false;

                if (question.type === QuestionType.TrueFalse) {
                    const tfResponse = response as TrueFalseQuestionResponseDTO;
                    const tfQuestion = question as TrueFalseQuestionDTO;
                    return tfResponse.selectedAnswer === tfQuestion.correctAnswer;
                } else if (question.type === QuestionType.MultipleChoice) {
                    const mcResponse = response as MultipleChoiceQuestionResponseDTO;
                    const mcQuestion = question as MultipleChoiceQuestionDTO;
                    return JSON.stringify(mcResponse.selectedAnswerIndexes || [].sort()) ===
                        JSON.stringify(mcQuestion.correctAnswerIndexes || [].sort());
                }
                return false;
            }).length;

            return {
                question,
                totalResponses,
                correctResponses,
                percentageCorrect: totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0
            };
        });
    }, [attempts, selectedPublication]);

    if (isGettingPublicationsByQuizId || isLoadingAttempts) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!publications || publications.length === 0) {
        return <NoPublicationsPlaceholder />;
    }

    return (
        <motion.div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header con indicatore di aggiornamento */}
                <div className="bg-primary text-white p-6 flex justify-between items-center">
                    <motion.h1
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-3xl font-bold"
                    >
                        Quiz Performance Analytics
                    </motion.h1>
                    <div className="flex items-center gap-4">
                        {isFetching && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="loading loading-spinner loading-sm"></span>
                                <span>Updating in real-time...</span>
                            </div>
                        )}
                        <button
                            onClick={() => refetch()}
                            className="btn btn-sm btn-ghost btn-circle"
                            disabled={isFetching}
                        >
                            <svg
                                className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <PublicationSelector
                    publications={publications}
                    selectedPublication={selectedPublication}
                    onPublicationChange={setSelectedPublication}
                />

                {selectedPublication && (
                    <div className="relative">
                        {isFetching && (
                            <div className="absolute top-2 right-2 z-10">
                                <span className="badge badge-primary gap-2">
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Updating...
                                </span>
                            </div>
                        )}
                        <PublicationDetails publication={selectedPublication} />
                        {questionStats && (
                            <QuestionStatistics questionStats={questionStats} />
                        )}
                        {attempts && attempts.length > 0 && (
                            <AttemptsTable
                                attempts={attempts}
                                publication={selectedPublication}
                                onAttemptSelect={setSelectedAttempt}
                                isUpdating={isFetching}
                            />
                        )}
                        {selectedAttempt && (
                            <AttemptDetails
                                attempt={selectedAttempt}
                                publication={selectedPublication}
                            />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
export default PublicationStatsPage;