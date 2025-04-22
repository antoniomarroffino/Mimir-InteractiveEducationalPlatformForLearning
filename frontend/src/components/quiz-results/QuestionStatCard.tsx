import React from "react";
import {QuestionDTO} from "@dti-isin/backend-api-client";
import {FaCheckCircle, FaClock, FaUsers} from "react-icons/fa";
import {formatDuration} from "../../utils/timeUtils";

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
    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'from-success to-success/70';
        if (percentage >= 60) return 'from-primary to-secondary';
        return 'from-error to-error/70';
    };

    return (
        <div className="group bg-base-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300
                        hover:-translate-y-1 border border-base-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

            <div className="flex items-start justify-between gap-6 relative">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary
                                      flex items-center justify-center text-primary-content font-bold
                                      shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {index + 1}
                        </div>
                        <h3 className="font-medium text-base line-clamp-1 group-hover:line-clamp-none
                                     transition-all duration-300 text-base-content">
                            {question.questionText}
                        </h3>
                    </div>

                    <div className="relative mb-4">
                        <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${getProgressColor(percentageCorrect)} 
                                          transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(var(--primary),.3)]`}
                                style={{width: `${percentageCorrect}%`}}
                            />
                        </div>
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 bg-base-content/90
                                      text-base-100 text-xs px-2 py-1 rounded-full transform translate-x-full
                                      opacity-0 group-hover:opacity-100 group-hover:translate-x-0
                                      transition-all duration-300">
                            {percentageCorrect.toFixed(1)}%
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-base-content/70">
                        <div className="flex items-center gap-2">
                            <FaClock className="text-primary"/>
                            {formatDuration(averageTimeSpent)}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-base-content/20"/>
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-success"/>
                            {((correctResponses / totalResponses) * 100).toFixed(0)}% success rate
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-center p-3 rounded-xl bg-base-200 min-w-[5rem]
                                  group-hover:bg-base-300 transition-colors">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <FaUsers className="text-primary"/>
                            <div className="text-xl font-bold text-primary
                                          group-hover:scale-110 transition-transform">
                                {totalResponses}
                            </div>
                        </div>
                        <div className="text-xs text-base-content/70">Responses</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-base-200 min-w-[5rem]
                                  group-hover:bg-base-300 transition-colors">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <FaCheckCircle className="text-success"/>
                            <div className="text-xl font-bold text-success
                                          group-hover:scale-110 transition-transform">
                                {correctResponses}
                            </div>
                        </div>
                        <div className="text-xs text-base-content/70">Correct</div>
                    </div>
                </div>
            </div>
        </div>
    );
};