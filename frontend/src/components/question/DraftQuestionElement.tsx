import React from 'react';
import {QuestionType} from '@dti-isin/backend-api-client';
import {BsListCheck, BsToggleOn} from 'react-icons/bs';

interface DraftQuestionElementProps {
    questionText?: string;
    questionType?: QuestionType;
}

export const DraftQuestionElement: React.FC<DraftQuestionElementProps> = ({
                                                                              questionText,
                                                                              questionType
                                                                          }) => {
    const getQuestionTypeStyles = () => {
        switch (questionType) {
            case QuestionType.TrueFalse:
                return {
                    icon: <BsToggleOn className="text-green-600"/>,
                    borderColor: 'border-green-500',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-700'
                };
            case QuestionType.MultipleChoice:
                return {
                    icon: <BsListCheck className="text-blue-600"/>,
                    borderColor: 'border-blue-500',
                    bgColor: 'bg-blue-50',
                    textColor: 'text-blue-700'
                };
            default:
                return {
                    icon: null,
                    borderColor: 'border-gray-300',
                    bgColor: 'bg-gray-50',
                    textColor: 'text-gray-700'
                };
        }
    };

    const typeStyles = getQuestionTypeStyles();

    return (
        <div
            className={`
                relative 
                p-3 
                rounded-lg 
                bg-base-100 
                border 
                ${typeStyles.borderColor}
                shadow-sm
                flex
                items-start
            `}
        >
            <div
                className={`
                    absolute 
                    left-0 
                    top-0 
                    bottom-0 
                    w-1.5 
                    rounded-l-lg 
                    ${typeStyles.bgColor}
                    ${typeStyles.borderColor}
                `}
            />

            <div className="flex items-start w-full pl-3">
                <div className="mr-3 mt-1">
                    {typeStyles.icon}
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-semibold line-clamp-1 ${typeStyles.textColor}`}>
                            Draft Question
                        </span>
                        {questionType && (
                            <span
                                className={`text-xs rounded px-2 py-0.5 ${typeStyles.bgColor} ${typeStyles.textColor}`}>
                                {questionType}
                            </span>
                        )}
                    </div>

                    <p className="text-base-content/70 italic text-sm">
                        {questionText || 'Start typing your question...'}
                    </p>
                </div>
            </div>
        </div>
    );
};