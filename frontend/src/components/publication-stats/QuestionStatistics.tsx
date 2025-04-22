import { QuestionDTO, QuizAttemptDTO } from "@dti-isin/backend-api-client";
import React, { useMemo } from "react";
import { FaCheckCircle, FaUsers, FaQuestionCircle } from 'react-icons/fa';
import { QuestionStatCard } from "../quiz-results/QuestionStatCard";
import { calculateQuestionStats } from "../../utils/statisticsUtils";
import { motion } from "framer-motion";

interface QuestionStatisticsProps {
    questions: QuestionDTO[];
    attempts: QuizAttemptDTO[];
}

export const QuestionStatistics: React.FC<QuestionStatisticsProps> = ({
                                                                          questions,
                                                                          attempts
                                                                      }) => {
    const questionStats = useMemo(() =>
            calculateQuestionStats(questions, attempts),
        [questions, attempts]
    );

    if (!questions.length || !attempts.length) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaQuestionCircle className="text-primary w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-base-content/70">
                    No Question Data
                </h3>
                <p className="mt-2 text-sm text-base-content/50 max-w-md">
                    Add questions and wait for attempts to see performance statistics
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10
                          rounded-xl p-6 border border-primary/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FaQuestionCircle className="text-primary w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-base-content">
                                Question Performance
                            </h2>
                            <p className="text-sm text-base-content/70">
                                Detailed analysis of each question
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="badge badge-primary gap-2 py-3 px-4">
                            <FaUsers className="w-4 h-4" />
                            <span className="font-medium">Responses</span>
                        </div>
                        <div className="badge badge-success gap-2 py-3 px-4">
                            <FaCheckCircle className="w-4 h-4" />
                            <span className="font-medium">Correct</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {questionStats.map((stat, index) => (
                    <motion.div
                        key={stat.question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <QuestionStatCard
                            index={index}
                            question={stat.question}
                            percentageCorrect={stat.percentageCorrect}
                            averageTimeSpent={stat.averageTimeSpent}
                            totalResponses={stat.totalResponses}
                            correctResponses={stat.correctResponses}
                        />
                    </motion.div>
                ))}
            </div>

            {questionStats.length === 0 && (
                <div className="text-center py-8 text-base-content/60">
                    <p>No statistics available for this quiz yet</p>
                </div>
            )}
        </div>
    );
};