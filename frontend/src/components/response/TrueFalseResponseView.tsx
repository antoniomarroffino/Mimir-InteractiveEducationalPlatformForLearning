import React from 'react';
import { BsCheckCircle } from 'react-icons/bs';

interface TrueFalseResponseViewProps {
    isCorrect: boolean;
    answer: boolean;
    label: string;
    highlight?: boolean;
}

export const TrueFalseResponseView: React.FC<TrueFalseResponseViewProps> = ({
                                                                                isCorrect,
                                                                                answer,
                                                                                label,
                                                                                highlight = false
                                                                            }) => (
    <div className={`
        flex-1 rounded-lg transition-all duration-300
        ${highlight
        ? 'bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg'
        : 'bg-base-200'
    }
    `}>
        <div className="p-3">
            <div className="text-xs text-base-content/70 mb-2">{label}</div>
            <div className="flex items-center gap-3">
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${answer
                    ? 'bg-success/20 text-success'
                    : 'bg-error/20 text-error'
                }
                `}>
                    {answer ? 'T' : 'F'}
                </div>
                <span className={`
                    text-sm font-medium
                    ${highlight && isCorrect ? 'text-success' : ''}
                `}>
                    {answer ? 'True' : 'False'}
                </span>
                {isCorrect && highlight && (
                    <div className="ml-auto">
                        <BsCheckCircle className="text-success" />
                    </div>
                )}
            </div>
        </div>
    </div>
);