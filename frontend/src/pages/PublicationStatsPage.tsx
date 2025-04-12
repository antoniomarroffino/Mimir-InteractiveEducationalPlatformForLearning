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
import {AnimatePresence, motion} from 'framer-motion';
import { useGetQuizPublicationsByQuizId } from "../hooks/quizPublication/useGetQuizPublicationsByQuizId.ts";
import NoPublicationsPlaceholder from "../components/quizPublication/NoPublicationsPlaceholder.tsx";
import {useGetQuizAttemptsByPublication} from "../hooks/quizAttempt/useGetQuizAttemptsByPublication.ts";
import {QuestionStatistics} from "../components/publication-stats/QuestionStatistics.tsx";
import {AttemptsTable} from "../components/publication-stats/AttemptsTable.tsx";
import {AttemptDetails} from "../components/attempt/AttemptDetails.tsx";
import {PublicationSelector} from "../components/publication-stats/PublicationSelector.tsx";
import {ResponseTimeChart} from "../components/publication-stats/ResponseTimeChart.tsx";

const PublicationStatsPage: React.FC = () => {
    const { quizId } = useParams();
    const { data: publications, isLoading: isGettingPublicationsByQuizId } = useGetQuizPublicationsByQuizId(quizId!);
    const [selectedPublication, setSelectedPublication] = useState<QuizPublicationDTO | null>(null);
    const {
        data: attempts,
        isLoading: isLoadingAttempts,
        isFetching
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
        } else {
            setSelectedAttempt(null);
        }
    }, [attempts]);

    useEffect(() => {
        setSelectedAttempt(null);
    }, [selectedPublication]);

    const questionStats = useMemo(() => {
        if (!attempts || !selectedPublication?.questions) return null;

        return selectedPublication.questions.map(question => {
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

            const averageTimeSpent = responses.reduce((acc, response) =>
                acc + (response.timeSpent || 0), 0
            ) / (totalResponses || 1);

            return {
                question,
                totalResponses,
                correctResponses,
                percentageCorrect: totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0,
                averageTimeSpent
            };
        });
    }, [attempts, selectedPublication]);

    if (isGettingPublicationsByQuizId || isLoadingAttempts) {
        return (
            <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!publications || publications.length === 0) {
        return <NoPublicationsPlaceholder />;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-base-200 to-base-300">
            <div className="container mx-auto p-4 h-full">
                <div className="bg-base-100 rounded-xl shadow-lg">
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-base-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Quiz Analytics
                                </h1>
                                <PublicationSelector
                                    publications={publications || []}
                                    selectedPublication={selectedPublication}
                                    onPublicationChange={setSelectedPublication}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {selectedPublication && (
                                    <motion.div
                                        key={selectedPublication.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-4 space-y-6"
                                    >
                                        <div className="card bg-base-200">
                                            <div className="card-body">
                                                <PublicationDetails publication={selectedPublication} />
                                            </div>
                                        </div>

                                        {questionStats && (
                                            <div className="space-y-6">
                                                <div className="card bg-base-200">
                                                    <div className="card-body">
                                                        <ResponseTimeChart questionStats={questionStats} />
                                                    </div>
                                                </div>

                                                <div className="card bg-base-200">
                                                    <div className="card-body">
                                                        <QuestionStatistics
                                                            questions={selectedPublication.questions || []}
                                                            attempts={attempts || []}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {attempts && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="card bg-base-200">
                                                    <div className="card-body p-0">
                                                        <AttemptsTable
                                                            attempts={attempts}
                                                            publication={selectedPublication}
                                                            onAttemptSelect={setSelectedAttempt}
                                                            isUpdating={isFetching}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="md:col-span-2">
                                                    {selectedAttempt && attempts.some(a => a.id === selectedAttempt.id) ? (
                                                        <div className="card bg-base-200">
                                                            <div className="card-body">
                                                                <AttemptDetails
                                                                    attempt={selectedAttempt}
                                                                    publication={selectedPublication}
                                                                    onClose={() => setSelectedAttempt(null)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="card bg-base-200">
                                                            <div className="card-body flex items-center justify-center text-center">
                                                                <div className="text-6xl mb-4">👆</div>
                                                                <h3 className="text-xl font-bold text-base-content/70">
                                                                    Select an Attempt
                                                                </h3>
                                                                <p className="text-base-content/50 mt-2">
                                                                    Click on any attempt to see detailed information
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PublicationStatsPage;