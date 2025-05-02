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
        } hover:shadow-md focus:shadow-md transition-all duration-300`}>
            <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-b border-base-200 bg-base-100 rounded-t-lg">
                <div className="flex flex-wrap gap-4 text-sm text-base-content/70 items-center">
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4"/>
                        <span>Time: {formatQuestionTime(response?.timeSpent)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Points: {earnedPoints}/{totalPoints}</span>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <div
                        className={`badge px-3 py-1 text-sm font-semibold uppercase tracking-wide ${
                            isAnswered
                                ? isCorrect
                                    ? 'badge-success'
                                    : 'badge-error'
                                : 'badge-warning'
                        }`}
                    >
                        {isAnswered
                            ? isCorrect
                                ? 'Correct'
                                : 'Incorrect'
                            : 'Not answered'}
                    </div>
                    {isCorrect && totalPoints > 1 && (
                        <span className="text-sm font-bold text-success bg-success/10 px-3 py-1 rounded-full">
                            +{earnedPoints} pts
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div
                        className={`text-lg ${
                            isAnswered
                                ? isCorrect
                                    ? 'text-success'
                                    : 'text-error'
                                : 'text-warning'
                        }`}
                        title={isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}
                    >
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
                            <span className="text-xs text-base-content/70 ml-2 whitespace-nowrap">
                                Worth {totalPoints} point{totalPoints !== 1 && 's'}
                            </span>
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
