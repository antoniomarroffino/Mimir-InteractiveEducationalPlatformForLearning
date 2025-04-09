import {BsCheckCircle, BsXCircle} from "react-icons/bs";
import React from "react";

interface ChoiceOptionProps {
    choice: string;
    isSelected?: boolean;
    isCorrect: boolean;
    showCorrect: boolean;
    showResponse: boolean;
}

export const ChoiceOption: React.FC<ChoiceOptionProps> = ({
                                                       choice,
                                                       isSelected,
                                                       isCorrect,
                                                       showCorrect,
                                                       showResponse
                                                   }) => {
    const getStatusIcon = () => {
        if (!showResponse) return null;

        if (isSelected) {
            return isCorrect ? (
                <div className="text-success">
                    <BsCheckCircle className="text-lg" />
                </div>
            ) : (
                <div className="text-error">
                    <BsXCircle className="text-lg" />
                </div>
            );
        }

        if (showCorrect && isCorrect) {
            return (
                <div className="text-success/70">
                    <BsCheckCircle className="text-lg" />
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`
            rounded-lg transition-all duration-300
            ${isSelected
            ? isCorrect
                ? 'bg-success/10 border-l-4 border-l-success'
                : 'bg-error/10 border-l-4 border-l-error'
            : showCorrect && isCorrect
                ? 'bg-success/5 border-l-4 border-l-success/50'
                : 'bg-base-200'
        }
        `}>
            <div className="p-3 flex items-center gap-3">
                <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${isSelected
                    ? isCorrect
                        ? 'bg-success/20'
                        : 'bg-error/20'
                    : 'bg-base-300'
                }
                `}>
                    {String.fromCharCode(65)}
                </div>

                <span className="flex-1 text-sm">{choice}</span>

                {getStatusIcon()}

                {showCorrect && isCorrect && !isSelected && (
                    <span className="text-xs text-success/70">
                        Correct answer
                    </span>
                )}
            </div>
        </div>
    );
};