import { QuestionDTO, QuizAttemptDTO } from "@dti-isin/backend-api-client";
import React, { useMemo } from "react";
import { FaCheckCircle, FaUsers, FaChartLine, FaClock } from 'react-icons/fa';
import { isResponseCorrect } from "../../utils/responseUtils.ts";

interface QuestionStatisticsProps {
    questions: QuestionDTO[];
    attempts: QuizAttemptDTO[];
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return minutes > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${remainingSeconds}s`;
};

export const QuestionStatistics: React.FC<QuestionStatisticsProps> = ({ questions, attempts }) => {
    const questionStats = useMemo(() => {
        return questions.map(question => {
            const responses = attempts.flatMap(attempt =>
                attempt.responses?.filter(response =>
                    response.questionId === question.id
                ) || []
            );

            const totalResponses = responses.length;
            const correctResponses = responses.filter(response =>
                isResponseCorrect(question, response)
            ).length;

            const averageTimeSpent = responses.reduce((acc, response) =>
                acc + (response.timeSpent || 0), 0
            ) / (totalResponses || 1);

            return {
                question,
                totalResponses,
                correctResponses,
                percentageCorrect: totalResponses > 0
                    ? (correctResponses * 100) / totalResponses
                    : 0,
                averageTimeSpent
            };
        });
    }, [questions, attempts]);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
                    <div
                        key={stat.question.id}
                        className="group bg-base-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-base-200"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-bold">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-medium text-sm line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                                        {stat.question.questionText}
                                    </h3>
                                </div>

                                <div className="relative">
                                    <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(var(--primary),.3)]"
                                            style={{ width: `${stat.percentageCorrect}%` }}
                                        />
                                    </div>
                                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 bg-secondary text-secondary-content text-xs px-2 py-1 rounded-full transform translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        {stat.percentageCorrect.toFixed(1)}%
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-base-content/70 flex items-center gap-2">
                                    <FaClock className="text-primary"/>
                                    Average response time: {formatTime(stat.averageTimeSpent)}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center p-2 rounded-lg bg-base-200 min-w-[4rem]">
                                    <div className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">
                                        {stat.totalResponses}
                                    </div>
                                    <div className="text-xs text-base-content/70">Total</div>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-base-200 min-w-[4rem]">
                                    <div className="text-xl font-bold text-success group-hover:scale-110 transition-transform">
                                        {stat.correctResponses}
                                    </div>
                                    <div className="text-xs text-base-content/70">Correct</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};