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
}

export const QuestionResult: React.FC<QuestionResultProps> = ({
                                                                  question,
                                                                  response,
                                                                  isAnswered,
                                                                  isCorrect
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
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <ClockIcon className="w-4 h-4"/>
                    <span>Time spent: {formatQuestionTime(response?.timeSpent)}</span>
                </div>
                <div className={`badge ${isCorrect ? 'badge-success' : 'badge-error'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
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
                        <h3 className="text-sm font-medium">{question.questionText}</h3>
                        <div className="text-sm">
                            {strategy.renderResponse({question, response, isAnswered})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};