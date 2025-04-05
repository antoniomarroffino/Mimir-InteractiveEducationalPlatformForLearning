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
    <div className={`flex items-center gap-2 p-3 rounded-lg ${
        isCorrect ? 'bg-success/20' : 'bg-error/20'
    }`}>
        <div className={`text-2xl ${isCorrect ? 'text-success' : 'text-error'}`}>
            {isCorrect ? <BsCheckCircle/> : <BsXCircle/>}
        </div>
        <span className="font-medium">{answer ? 'True' : 'False'}</span>
    </div>
);