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
import { PublicationDetails } from "../components/quizPublication/PublicationDetails";
import { AnimatePresence, motion } from 'framer-motion';
import { useGetQuizPublicationsByQuizId } from "../hooks/quizPublication/useGetQuizPublicationsByQuizId";
import NoPublicationsPlaceholder from "../components/quizPublication/NoPublicationsPlaceholder";
import { useGetQuizAttemptsByPublication } from "../hooks/quizAttempt/useGetQuizAttemptsByPublication";
import { QuestionStatistics } from "../components/publication-stats/QuestionStatistics";
import { AttemptsTable } from "../components/publication-stats/AttemptsTable";
import { AttemptDetails } from "../components/attempt/AttemptDetails";
import { PublicationSelector } from "../components/publication-stats/PublicationSelector";
import { useGetQuizById } from "../hooks/quiz/useGetQuizById";
import { useGetCourseById } from "../hooks/course/useGetCourseById";
import { useGetFolderById } from "../hooks/folder/useGetFolderById";
import { QuizResultsPageHeader } from "../components/quiz-results/QuizResultPageHeader";
import {ChartSelector} from "../components/quiz-results/charts/ChartSelector.tsx";
import {FaCalendar} from "react-icons/fa";

const PublicationStatsPage: React.FC = () => {
    const { quizId, courseId, folderId } = useParams();
    const { data: currentQuiz } = useGetQuizById(courseId!, folderId!, quizId!);
    const { data: currentCourse } = useGetCourseById(courseId!);
    const { data: currentFolder } = useGetFolderById(courseId!, folderId!);
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

    if (!publications || publications.length === 0 || !currentQuiz || !currentCourse || !currentFolder) {
        return <NoPublicationsPlaceholder />;
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <QuizResultsPageHeader
                    course={currentCourse}
                    folder={currentFolder}
                    quiz={currentQuiz}
                />

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body space-y-6">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                                <FaCalendar className="text-primary" />
                                Publication Details
                            </h2>
                            <div className="w-96">
                                <PublicationSelector
                                    publications={publications}
                                    selectedPublication={selectedPublication}
                                    onPublicationChange={setSelectedPublication}
                                />
                            </div>
                        </div>

                        {selectedPublication && (
                            <PublicationDetails publication={selectedPublication} />
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedPublication && questionStats && (
                        <motion.div
                            key={selectedPublication.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="card bg-base-100 shadow-lg">
                                <div className="card-body">
                                    <ChartSelector
                                        questionStats={questionStats}
                                        attempts={attempts || []}
                                        questions={selectedPublication.questions || []}
                                    />
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-lg">
                                <div className="card-body">
                                    <QuestionStatistics
                                        questions={selectedPublication.questions || []}
                                        attempts={attempts || []}
                                    />
                                </div>
                            </div>

                            {attempts && (
                                <div className="card bg-base-100 shadow-lg">
                                    <div className="card-body p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="border-r border-base-200">
                                                <AttemptsTable
                                                    attempts={attempts}
                                                    publication={selectedPublication}
                                                    onAttemptSelect={setSelectedAttempt}
                                                    isUpdating={isFetching}
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                {selectedAttempt && attempts.some(a => a.id === selectedAttempt.id) ? (
                                                    <AttemptDetails
                                                        attempt={selectedAttempt}
                                                        publication={selectedPublication}
                                                        onClose={() => setSelectedAttempt(null)}
                                                        showBadgeAssignment={!selectedPublication.anonymous}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center text-center h-full">
                                                        <div>
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
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
};

export default PublicationStatsPage;