import React from 'react';
import {BsCheckCircle, BsXCircle} from 'react-icons/bs';

interface TrueFalseTemplateProps {
    correctAnswer: boolean;
    onCorrectAnswerChange: (value: boolean) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const TrueFalseQuestionTemplate: React.FC<TrueFalseTemplateProps> = ({
                                                                                correctAnswer,
                                                                                onCorrectAnswerChange,
                                                                                disabled = false
                                                                            }) => {
    return (
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-base-content/80">
                    Select the Correct Answer
                </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div
                    className={`
                        p-3 
                        rounded-lg 
                        flex 
                        items-center 
                        justify-center 
                        gap-2 
                        cursor-pointer 
                        transition-all 
                        ${correctAnswer
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-base-200 text-base-content/70 hover:bg-base-300'}
                    `}
                    onClick={() => !disabled && onCorrectAnswerChange(true)}
                >
                    <BsCheckCircle className="text-2xl"/>
                    <span className="font-semibold">True</span>
                </div>
                <div
                    className={`
                        p-3 
                        rounded-lg 
                        flex 
                        items-center 
                        justify-center 
                        gap-2 
                        cursor-pointer 
                        transition-all 
                        ${!correctAnswer
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-base-200 text-base-content/70 hover:bg-base-300'}
                    `}
                    onClick={() => !disabled && onCorrectAnswerChange(false)}
                >
                    <BsXCircle className="text-2xl"/>
                    <span className="font-semibold">False</span>
                </div>
            </div>
        </div>
    );
};