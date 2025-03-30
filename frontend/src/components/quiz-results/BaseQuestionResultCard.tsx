import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { QuestionDTO, QuestionResponseDTO } from '@dti-isin/backend-api-client';

interface BaseQuestionResultCardProps {
    question: QuestionDTO;
    response: QuestionResponseDTO;
    index: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

export const BaseQuestionResultCard: React.FC<BaseQuestionResultCardProps> = ({
                                                                                  question,
                                                                                  index,
                                                                                  userAnswer,
                                                                                  correctAnswer,
                                                                                  isCorrect
                                                                              }) => {
    return (
        <div
            className={`
                card 
                ${isCorrect
                ? 'bg-success/10 border-l-4 border-success'
                : 'bg-error/10 border-l-4 border-error'
            } 
                shadow-md transition-all hover:shadow-lg
            `}
        >
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="card-title text-xl flex-grow">
                        Question {index + 1}: {question.questionText}
                    </h3>
                    {isCorrect
                        ? <CheckCircleIcon className="h-8 w-8 text-success" />
                        : <XCircleIcon className="h-8 w-8 text-error" />
                    }
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <div className="font-bold mb-2 text-primary">
                            Your answer:
                        </div>
                        <p className={`
                            p-2 rounded 
                            ${isCorrect
                            ? 'bg-success/20 text-success-content'
                            : 'bg-error/20 text-error-content'
                        }
                        `}>
                            {userAnswer}
                        </p>
                    </div>

                    <div>
                        <div className="font-bold mb-2 text-primary">
                            Correct answer:
                        </div>
                        <p className="p-2 bg-info/20 text-info-content rounded">
                            {correctAnswer}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};