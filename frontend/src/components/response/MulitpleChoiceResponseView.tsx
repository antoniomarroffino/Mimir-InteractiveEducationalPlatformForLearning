import React from 'react';
import {BsCheckCircle, BsQuestionCircle, BsXCircle} from 'react-icons/bs';

interface MultipleChoiceResponseViewProps {
    choices: string[];
    selectedIndexes: number[];
    correctIndexes: number[];
}

export const MultipleChoiceResponseView: React.FC<MultipleChoiceResponseViewProps> = ({
                                                                                          choices,
                                                                                          selectedIndexes,
                                                                                          correctIndexes
                                                                                      }) => (
    <div className="grid gap-2">
        {choices.map((choice, index) => {
            const isSelected = selectedIndexes.includes(index);
            const isCorrect = correctIndexes.includes(index);

            return (
                <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center gap-2 ${
                        isSelected
                            ? isCorrect
                                ? 'bg-success/20'
                                : 'bg-error/20'
                            : isCorrect
                                ? 'bg-success/10'
                                : 'bg-base-200'
                    }`}
                >
                    <div className={`text-xl ${
                        isSelected
                            ? isCorrect
                                ? 'text-success'
                                : 'text-error'
                            : isCorrect
                                ? 'text-success/50'
                                : 'text-base-content/30'
                    }`}>
                        {isSelected
                            ? isCorrect
                                ? <BsCheckCircle/>
                                : <BsXCircle/>
                            : <BsQuestionCircle/>}
                    </div>
                    <span className={`font-medium ${
                        isSelected && !isCorrect ? 'text-error' : ''
                    }`}>
                        {choice}
                    </span>
                </div>
            );
        })}
    </div>
);