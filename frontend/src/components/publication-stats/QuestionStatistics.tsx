import {QuestionDTO} from "@dti-isin/backend-api-client";
import React from "react";

interface QuestionStatisticsProps {
    questionStats: {
        question: QuestionDTO;
        totalResponses: number;
        correctResponses: number;
        percentageCorrect: number;
    }[];
}

export const QuestionStatistics: React.FC<QuestionStatisticsProps> = ({ questionStats }) => {
    return (
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
    );
};