import React from 'react';
import {QuestionDTO, QuestionResponseDTO} from '@dti-isin/backend-api-client';
import {BsCheckCircle, BsQuestionCircle, BsXCircle} from 'react-icons/bs';
import {ResponseStrategyFactory} from "./ResponseStrategyFactory.tsx";

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
        <div className={`card ${
            isAnswered
                ? isCorrect
                    ? 'bg-success/5 border-2 border-success/20'
                    : 'bg-error/5 border-2 border-error/20'
                : 'bg-warning/5 border-2 border-warning/20'
        } shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="card-body">
                <div className="flex items-start gap-4">
                    <div className={`text-2xl ${
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
                    <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">{question.questionText}</h3>
                        <div className="mt-4">
                            {strategy.renderResponse({question, response, isAnswered})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};