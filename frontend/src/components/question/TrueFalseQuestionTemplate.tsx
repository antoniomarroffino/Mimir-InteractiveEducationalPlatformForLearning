import React from 'react';

interface TrueFalseTemplateProps {
    correctAnswer: boolean;
    onCorrectAnswerChange: (value: boolean) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const TrueFalseQuestionTemplate: React.FC<TrueFalseTemplateProps> = ({
                                                                                correctAnswer,
                                                                                onCorrectAnswerChange,
                                                                                isLoading = false,
                                                                                disabled = false
                                                                            }) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">Correct Answer</span>
            </label>
            <div className="flex items-center space-x-4">
                <span>True</span>
                <input
                    type="radio"
                    className="radio"
                    checked={correctAnswer}
                    onChange={() => onCorrectAnswerChange(true)}
                    disabled={isLoading || disabled}
                />
                <span>False</span>
                <input
                    type="radio"
                    className="radio"
                    checked={!correctAnswer}
                    onChange={() => onCorrectAnswerChange(false)}
                    disabled={isLoading || disabled}
                />
            </div>
        </div>
    );
};