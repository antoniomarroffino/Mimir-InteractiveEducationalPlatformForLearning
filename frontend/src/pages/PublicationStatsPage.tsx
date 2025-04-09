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
        }
    }, [attempts]);

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
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/70">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!publications || publications.length === 0) {
        return <NoPublicationsPlaceholder />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="bg-primary text-primary-content p-4 sm:p-6">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-2xl sm:text-3xl font-bold text-center"
                        >
                            Quiz Performance Analytics
                        </motion.h1>
                    </div>

                    {/* Publication Selector */}
                    <div className="p-4 sm:p-6 border-b">
                        <PublicationSelector
                            publications={publications || []}
                            selectedPublication={selectedPublication}
                            onPublicationChange={setSelectedPublication}
                        />
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {selectedPublication && (
                            <motion.div
                                key={selectedPublication.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="divide-y divide-base-200"
                            >
                                <div className="p-4 sm:p-6">
                                    <PublicationDetails publication={selectedPublication} />
                                </div>

                                {questionStats && (
                                    <div className="p-4 sm:p-6">
                                        <QuestionStatistics questionStats={questionStats} />
                                    </div>
                                )}

                                {attempts && attempts.length > 0 && (
                                    <div className="p-4 sm:p-6">
                                        <AttemptsTable
                                            attempts={attempts}
                                            publication={selectedPublication}
                                            onAttemptSelect={setSelectedAttempt}
                                            isUpdating={isFetching}
                                        />
                                    </div>
                                )}

                                <AnimatePresence>
                                    {selectedAttempt && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="p-4 sm:p-6 bg-base-200"
                                        >
                                            <AttemptDetails
                                                attempt={selectedAttempt}
                                                publication={selectedPublication}
                                                onClose={() => setSelectedAttempt(null)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};
export default PublicationStatsPage;