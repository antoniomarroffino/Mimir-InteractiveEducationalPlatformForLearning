import React from 'react';
import {QuestionDTO, QuestionResponseDTO} from '@dti-isin/backend-api-client';
import {BsCheckCircle, BsQuestionCircle, BsXCircle} from 'react-icons/bs';
import {ResponseStrategyFactory} from "./ResponseStrategyFactory.tsx";
import {ClockIcon} from "@heroicons/react/24/outline";
import {formatQuestionTime} from "../../utils/timeUtils.ts";

interface QuestionResultProps {
    question: QuestionDTO;
    response?: QuestionResponseDTO;
    isAnswered: boolean;
    isCorrect: boolean;
    earnedPoints: number;
    totalPoints: number;
}

export const QuestionResult: React.FC<QuestionResultProps> = ({
                                                                  question,
                                                                  response,
                                                                  isAnswered,
                                                                  isCorrect,
                                                                  earnedPoints,
                                                                  totalPoints
                                                              }) => {
    const strategy = ResponseStrategyFactory.createStrategy(question.type);

    return (
        <div className={`bg-base-100 rounded-lg border-l-4 ${
            isAnswered
                ? isCorrect
                    ? 'border-l-success'
                    : 'border-l-error'
                : 'border-l-warning'
        } hover:shadow-md transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <ClockIcon className="w-4 h-4"/>
                        <span>Time spent: {formatQuestionTime(response?.timeSpent)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <span>Points: {earnedPoints}/{totalPoints}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`badge ${
                        isAnswered
                            ? isCorrect
                                ? 'badge-success'
                                : 'badge-error'
                            : 'badge-warning'
                    }`}>
                        {isAnswered
                            ? isCorrect
                                ? 'Correct'
                                : 'Incorrect'
                            : 'Not answered'
                        }
                    </div>
                    {isCorrect && totalPoints > 1 && (
                        <div className="badge badge-success">
                            +{earnedPoints} points
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className={`text-lg ${
                        isAnswered
                            ? isCorrect
                                ? 'text-success'
                                : 'text-error'
                            : 'text-warning'
                    }`}>
                        {isAnswered
                            ? isCorrect
                                ? <BsCheckCircle/>
                                : <BsXCircle/>
                            : <BsQuestionCircle/>}
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                            <h3 className="text-sm font-medium flex-1">
                                {question.questionText}
                            </h3>
                            {totalPoints > 1 && (
                                <span className="text-xs text-base-content/70 ml-2">
                                    Worth {totalPoints} points
                                </span>
                            )}
                        </div>
                        <div className="text-sm">
                            {strategy.renderResponse({question, response, isAnswered})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};