import { QuestionDTO, QuizAttemptDTO } from "@dti-isin/backend-api-client";
import React, { useMemo } from "react";
import { FaCheckCircle, FaUsers, FaChartLine } from 'react-icons/fa';
import { QuestionStatCard } from "../quiz-results/QuestionStatCard.tsx";
import { calculateQuestionStats } from "../../utils/statisticsUtils.ts";

interface QuestionStatisticsProps {
    questions: QuestionDTO[];
    attempts: QuizAttemptDTO[];
}

export const QuestionStatistics: React.FC<QuestionStatisticsProps> = ({ questions, attempts }) => {
    const questionStats = useMemo(() => calculateQuestionStats(questions, attempts), [questions, attempts]);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <h2 className="text-xl font-bold text-black bg-clip-text text-transparent">
                            Question Performance
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="badge badge-primary gap-1">
                            <FaUsers /> Responses
                        </div>
                        <div className="badge badge-success gap-1">
                            <FaCheckCircle /> Correct
                        </div>
                        <div className="badge badge-secondary gap-1">
                            <FaChartLine /> Success Rate
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {questionStats.map((stat, index) => (
                    <QuestionStatCard
                        key={stat.question.id}
                        index={index}
                        question={stat.question}
                        percentageCorrect={stat.percentageCorrect}
                        averageTimeSpent={stat.averageTimeSpent}
                        totalResponses={stat.totalResponses}
                        correctResponses={stat.correctResponses}
                    />
                ))}
            </div>
        </div>
    );
};
