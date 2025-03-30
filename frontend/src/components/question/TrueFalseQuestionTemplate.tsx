import React from 'react';
import {BsCheckCircle, BsXCircle} from 'react-icons/bs';

interface TrueFalseTemplateProps {
    correctAnswer: boolean;
    onCorrectAnswerChange: (value: boolean) => void;
    disabled?: boolean;
    isPreview?: boolean;
}

export const TrueFalseQuestionTemplate: React.FC<TrueFalseTemplateProps> = ({
                                                                                correctAnswer,
                                                                                onCorrectAnswerChange,
                                                                                disabled = false,
                                                                                isPreview = false,
                                                                            }) => {
    return (
        <div className={`bg-gradient-to-br p-4 rounded-lg ${isPreview ? 'from-base-100 to-base-100' : 'from-green-100 to-green-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-base-content/80">
                    {isPreview ? 'Correct Answer' : 'Select the Correct Answer'}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div
                    className={`
                        p-3 rounded-lg flex items-center justify-center gap-2
                        ${isPreview ?
                        (correctAnswer ? 'bg-green-500 text-white' : 'bg-base-200 opacity-50')
                        : `${correctAnswer ?
                            'bg-green-500 text-white shadow-lg' :
                            'bg-base-200 text-base-content/70 hover:bg-base-300'}`
                    }
                        ${!isPreview && !disabled ? 'cursor-pointer transition-all' : ''}
                    `}
                    onClick={!isPreview && !disabled ? () => onCorrectAnswerChange(true) : undefined}
                >
                    <BsCheckCircle className="text-2xl"/>
                    <span className="font-semibold">True</span>
                </div>
                <div
                    className={`
                        p-3 rounded-lg flex items-center justify-center gap-2
                        ${isPreview ?
                        (!correctAnswer ? 'bg-red-500 text-white' : 'bg-base-200 opacity-50')
                        : `${!correctAnswer ?
                            'bg-red-500 text-white shadow-lg' :
                            'bg-base-200 text-base-content/70 hover:bg-base-300'}`
                    }
                        ${!isPreview && !disabled ? 'cursor-pointer transition-all' : ''}
                    `}
                    onClick={!isPreview && !disabled ? () => onCorrectAnswerChange(false) : undefined}
                >
                    <BsXCircle className="text-2xl"/>
                    <span className="font-semibold">False</span>
                </div>
            </div>
        </div>
    );
};