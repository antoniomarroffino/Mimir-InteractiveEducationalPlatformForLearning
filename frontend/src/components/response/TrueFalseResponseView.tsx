import React from 'react';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

interface TrueFalseResponseViewProps {
    isCorrect: boolean;
    answer: boolean;
}

export const TrueFalseResponseView: React.FC<TrueFalseResponseViewProps> = ({
                                                                                isCorrect,
                                                                                answer
                                                                            }) => (
    <div className={`
        flex items-center gap-4 p-4 rounded-lg border-2 transition-all
        ${isCorrect
        ? 'bg-success/10 border-success'
        : 'bg-error/10 border-error'
    }
    `}>
        <div className={`text-2xl ${isCorrect ? 'text-success' : 'text-error'}`}>
            {isCorrect ? <BsCheckCircle/> : <BsXCircle/>}
        </div>
        <div className="flex-1">
            <span className="font-medium text-lg">
                {answer ? 'True' : 'False'}
            </span>
        </div>
        <div className="text-sm font-medium">
            {isCorrect ? 'Correct answer' : 'Wrong answer'}
        </div>
    </div>
);