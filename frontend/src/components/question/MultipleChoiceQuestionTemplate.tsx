import React, { useEffect, useState } from 'react';
import {
    BsCheckCircleFill,
    BsCircle,
    BsDashCircle
} from 'react-icons/bs';

interface MultipleChoiceTemplateProps {
    choices: string[];
    correctChoices: number[];
    onChoicesChange: (choices: string[]) => void;
    onCorrectChoicesChange: (correctChoices: number[]) => void;
    disabled?: boolean;
    onValidationChange?: (isValid: boolean) => void;
    isPreview?: boolean;
}

export const MultipleChoiceQuestionTemplate: React.FC<MultipleChoiceTemplateProps> = ({
                                                                                          choices,
                                                                                          correctChoices,
                                                                                          onChoicesChange,
                                                                                          onCorrectChoicesChange,
                                                                                          disabled = false,
                                                                                          onValidationChange,
                                                                                          isPreview = false,
                                                                                      }) => {
    const initialChoicesCount = Math.max(2, Math.min(choices.length || 2, 6));
    const [availableChoices, setAvailableChoices] = useState(initialChoicesCount);

    useEffect(() => {
        const newCount = Math.max(2, Math.min(choices.length, 6));
        if (newCount !== availableChoices) {
            setAvailableChoices(newCount);
        }
    }, [availableChoices, choices]);

    useEffect(() => {
        const filteredCorrectChoices = correctChoices.filter(index => index < availableChoices);

        if (filteredCorrectChoices.length !== correctChoices.length) {
            onCorrectChoicesChange(filteredCorrectChoices);
        }

        const isValid = filteredCorrectChoices.length > 0 &&
            choices.slice(0, availableChoices).some(choice => choice.trim() !== '');

        onValidationChange?.(isValid);
    }, [availableChoices, correctChoices, choices, onValidationChange, onCorrectChoicesChange]);

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        onChoicesChange(newChoices);
    };

    const toggleCorrectChoice = (index: number) => {
        const newCorrectChoices = correctChoices.includes(index)
            ? correctChoices.filter(i => i !== index)
            : [...correctChoices, index];

        onCorrectChoicesChange(newCorrectChoices);
    };

    const updateChoiceCount = (num: number) => {
        const newChoices = [...choices];

        if (num > newChoices.length) {
            while (newChoices.length < num) {
                newChoices.push('');
            }
        } else {
            newChoices.length = num;
        }

        setAvailableChoices(num);
        onChoicesChange(newChoices);
    };

    return (
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg">
            {!isPreview && (
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                    <span className="text-base font-semibold text-base-content/80 mb-2 sm:mb-0">
                        Multiple Choice Setup
                    </span>
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                        {[2, 3, 4, 5, 6].map(num => (
                            <button
                                key={num}
                                type="button"
                                className={`
                                    btn btn-xs 
                                    ${availableChoices === num ? 'btn-primary' : 'btn-ghost'}
                                    m-0.5
                                `}
                                onClick={() => updateChoiceCount(num)}
                                disabled={disabled || isPreview}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({length: availableChoices}).map((_, index) => (
                    <div
                        key={index}
                        className={`
                            bg-white rounded-lg shadow-sm overflow-hidden flex
                            ${isPreview && correctChoices.includes(index) ?
                            'ring-2 ring-green-500' : ''
                        }
                        `}
                    >
                        {isPreview ? (
                            <div className="p-2 flex-1">
                                {choices[index] || `Option ${index + 1}`}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder={`Answer ${index + 1}`}
                                className="input input-sm w-full px-2 py-1 border-none focus:outline-none"
                                value={choices[index] || ''}
                                onChange={(e) => handleChoiceChange(index, e.target.value)}
                                disabled={disabled || isPreview}
                            />
                        )}
                        <button
                            className={`
                                w-10 
                                flex 
                                items-center 
                                justify-center 
                                transition-all 
                                ${correctChoices.includes(index)
                                ? 'bg-green-500 text-white'
                                : 'bg-base-200 text-base-content/70 hover:bg-base-300'}
                            `}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCorrectChoice(index);
                            }}
                            disabled={disabled || isPreview}
                        >
                            {isPreview ? (
                                <BsCheckCircleFill className="text-lg"/>
                            ) : (
                                correctChoices.includes(index) ? (
                                    <BsCheckCircleFill className="text-lg"/>
                                ) : (
                                    <BsCircle className="text-lg"/>
                                )
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {!isPreview && correctChoices.length === 0 && (
                <div className="text-error text-xs mt-2 flex items-center gap-1">
                    <BsDashCircle className="text-sm"/>
                    Select at least one correct answer
                </div>
            )}
        </div>
    );
};