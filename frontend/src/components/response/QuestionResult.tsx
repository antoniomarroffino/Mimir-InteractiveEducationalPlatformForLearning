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
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="card-title flex-1">{question.questionText}</h3>
                    {isAnswered ? (
                        <div className={`badge ${
                            isCorrect ? 'badge-success' : 'badge-error'
                        } gap-1`}>
                            {isCorrect ? (
                                <>
                                    <BsCheckCircle/>
                                    Correct
                                </>
                            ) : (
                                <>
                                    <BsXCircle/>
                                    Incorrect
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="badge badge-warning gap-1">
                            <BsQuestionCircle/>
                            No Response
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    {strategy.renderResponse({question, response, isAnswered})}
                </div>
            </div>
        </div>
    );
};