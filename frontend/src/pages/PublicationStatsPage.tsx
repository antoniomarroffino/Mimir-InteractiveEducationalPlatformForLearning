import React, { useState, useEffect, useMemo } from 'react';
import {
    BsStars,
} from 'react-icons/bs';
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
import {useGetQuizAttemptsByPublication} from "../hooks/quizPublication/useGetQuizAttemptsByPublication.ts";

const PublicationStatsPage: React.FC = () => {
    const { quizId } = useParams();
    const { data: publications, isLoading: isGettingPublicationsByQuizId } = useGetQuizPublicationsByQuizId(quizId!);
    const [selectedPublication, setSelectedPublication] = useState<QuizPublicationDTO | null>(null);
    const { data: attempts, isLoading: isLoadingAttempts } = useGetQuizAttemptsByPublication(
        selectedPublication?.id || ''
    );
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8"
        >
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6 flex justify-between items-center">
                    <motion.h1
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-3xl font-bold flex items-center gap-3"
                    >
                        <BsStars className="text-yellow-300" />
                        Quiz Performance Analytics
                    </motion.h1>
                </div>

                {/* Publication Selector */}
                <div className="p-4 bg-base-200">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Select Publication</span>
                        </label>
                        <select
                            className="select select-primary"
                            value={selectedPublication?.id || ''}
                            onChange={(e) => {
                                const publication = publications.find(p => p.id === e.target.value);
                                setSelectedPublication(publication || null);
                            }}
                        >
                            {publications.map(publication => {
                                const createdDate = publication.createdAt
                                    ? new Date(publication.createdAt).toLocaleDateString()
                                    : 'Unavailable Date';

                                return (
                                    <option key={publication.id} value={publication.id}>
                                        {createdDate} - Code: {publication.publicationCode}
                                        {publication.anonymous ? ' (Anonymous)' : ''}
                                        {publication.published ? ' (Active)' : ' (Closed)'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Publication Details */}
                {selectedPublication && (
                    <div className="p-4">
                        <PublicationDetails publication={selectedPublication} />
                    </div>
                )}

                {/* General Statistics */}
                {attempts && attempts.length > 0 && (
                    <div className="p-4">
                        <table className="table w-full">
                            <tbody>
                            {attempts.map(attempt => (
                                <tr
                                    key={attempt.id}
                                    className="hover:bg-base-200 cursor-pointer"
                                    onClick={() => setSelectedAttempt(attempt)}
                                >
                                    <td>{attempt.userAzureOID || 'Anonymous'}</td>
                                    <td>{attempt.startedAt ? new Date(attempt.startedAt).toLocaleString() : 'N/A'}</td>
                                    <td>{attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : 'N/A'}</td>
                                    <td>
                                        {((attempt.responses || []).filter((r, i) => {
                                            const question = selectedPublication?.questions?.[i];
                                            if (!question || !r) return false;

                                            if (question.type === QuestionType.TrueFalse) {
                                                const tfResponse = r as TrueFalseQuestionResponseDTO;
                                                const tfQuestion = question as TrueFalseQuestionDTO;
                                                return tfResponse.selectedAnswer === tfQuestion.correctAnswer;
                                            }
                                            return false;
                                        }).length)} / {selectedPublication?.questions?.length || 0}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Question Statistics */}
                {questionStats && (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Question Statistics</h2>
                        <div className="space-y-4">
                            {questionStats.map((stat, index) => (
                                <div key={stat.question.id} className="card bg-base-100 shadow">
                                    <div className="card-body">
                                        <h3 className="card-title">Question {index + 1}</h3>
                                        <p>{stat.question.questionText}</p>
                                        <div className="stats shadow">
                                            <div className="stat">
                                                <div className="stat-title">Total Responses</div>
                                                <div className="stat-value">{stat.totalResponses}</div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-title">Correct Responses</div>
                                                <div className="stat-value text-success">
                                                    {stat.correctResponses}
                                                </div>
                                            </div>
                                            <div className="stat">
                                                <div className="stat-title">Success Rate</div>
                                                <div className="stat-value">
                                                    {stat.percentageCorrect.toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Attempt Details */}
                {selectedAttempt && (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Attempt Details</h2>
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h3 className="font-semibold">User</h3>
                                        <p>{selectedAttempt.userAzureOID || 'Anonymous'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Duration</h3>
                                        <p>
                                            {selectedAttempt.startedAt && selectedAttempt.completedAt ?
                                                `${Math.round((new Date(selectedAttempt.completedAt).getTime() -
                                                    new Date(selectedAttempt.startedAt).getTime()) / 1000)} seconds`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="font-semibold mb-2">Responses</h3>
                                <div className="space-y-4">
                                    {selectedAttempt.responses?.map((response, index) => {
                                        const question = selectedPublication?.questions?.[index];
                                        if (!question) return null;

                                        const isCorrect = question.type === QuestionType.TrueFalse ?
                                            (response as TrueFalseQuestionResponseDTO).selectedAnswer ===
                                            (question as TrueFalseQuestionDTO).correctAnswer :
                                            question.type === QuestionType.MultipleChoice &&
                                            JSON.stringify((response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes?.sort()) ===
                                            JSON.stringify((question as MultipleChoiceQuestionDTO).correctAnswerIndexes.sort());

                                        return (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-error/10'}`}
                                            >
                                                <p className="font-medium">{question.questionText}</p>
                                                {question.type === QuestionType.TrueFalse ? (
                                                    <p>Answer: {(response as TrueFalseQuestionResponseDTO).selectedAnswer ? 'True' : 'False'}</p>
                                                ) : (
                                                    <p>Selected Answers: {
                                                        (response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes?.map(
                                                            index => (question as MultipleChoiceQuestionDTO).correctAnswerIndexes[index]
                                                        ).join(', ')
                                                    }</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Individual Attempts */}
                {attempts && attempts.length > 0 && (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Individual Attempts</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Started At</th>
                                    <th>Completed At</th>
                                    <th>Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attempts.map(attempt => (
                                    <tr
                                        key={attempt.id}
                                        className="hover:bg-base-200 cursor-pointer"
                                        onClick={() => setSelectedAttempt(attempt)}
                                    >
                                        <td>{attempt.userAzureOID || 'Anonymous'}</td>
                                        <td>{new Date(attempt.startedAt!).toLocaleString()}</td>
                                        <td>{new Date(attempt.completedAt!).toLocaleString()}</td>
                                        <td>
                                            {attempt.responses!.filter((r, i) => {
                                                const question = selectedPublication?.questions?.[i];
                                                if (!question) return false;

                                                if (question.type === QuestionType.TrueFalse) {
                                                    return (r as TrueFalseQuestionResponseDTO).selectedAnswer ===
                                                        (question as TrueFalseQuestionDTO).correctAnswer;
                                                }
                                                return false; // Handle other types
                                            }).length} / {selectedPublication?.questions?.length}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PublicationStatsPage;