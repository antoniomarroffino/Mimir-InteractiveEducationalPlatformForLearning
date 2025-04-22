import React from "react";
import { QuestionDTO } from "@dti-isin/backend-api-client";
import { FaClock } from "react-icons/fa";
import { formatDuration } from "../../utils/timeUtils.ts";

interface QuestionStatCardProps {
    index: number;
    question: QuestionDTO;
    totalResponses: number;
    correctResponses: number;
    percentageCorrect: number;
    averageTimeSpent: number;
}

export const QuestionStatCard: React.FC<QuestionStatCardProps> = ({
                                                                      index,
                                                                      question,
                                                                      totalResponses,
                                                                      correctResponses,
                                                                      percentageCorrect,
                                                                      averageTimeSpent
                                                                  }) => {
    return (
        <div className="group bg-base-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-base-200">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-bold">
                            {index + 1}
                        </div>
                        <h3 className="font-medium text-sm line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                            {question.questionText}
                        </h3>
                    </div>

                    <div className="relative">
                        <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(var(--primary),.3)]"
                                style={{ width: `${percentageCorrect}%` }}
                            />
                        </div>
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 bg-secondary text-secondary-content text-xs px-2 py-1 rounded-full transform translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            {percentageCorrect.toFixed(1)}%
                        </div>
                    </div>

                    <div className="mt-3 text-sm text-base-content/70 flex items-center gap-2">
                        <FaClock className="text-primary" />
                        Average response time: {formatDuration(averageTimeSpent)}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center p-2 rounded-lg bg-base-200 min-w-[4rem]">
                        <div className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">
                            {totalResponses}
                        </div>
                        <div className="text-xs text-base-content/70">Total</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-base-200 min-w-[4rem]">
                        <div className="text-xl font-bold text-success group-hover:scale-110 transition-transform">
                            {correctResponses}
                        </div>
                        <div className="text-xs text-base-content/70">Correct</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
