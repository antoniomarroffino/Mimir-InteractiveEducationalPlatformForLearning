import {BsCheckCircle} from "react-icons/bs";
import React from "react";

interface MultipleChoiceResponseViewProps {
    choices: string[];
    selectedIndexes: number[];
    correctIndexes: number[];
    showCorrect?: boolean;
}

export const MultipleChoiceResponseView: React.FC<MultipleChoiceResponseViewProps> = ({
                                                                                          choices,
                                                                                          selectedIndexes,
                                                                                          correctIndexes,
                                                                                          showCorrect = false
                                                                                      }) => (
    <div className="grid gap-2">
        {choices.map((choice, index) => {
            const isSelected = selectedIndexes.includes(index);
            const isCorrect = correctIndexes.includes(index);

            return (
                <div
                    key={index}
                    className={`
                        p-3 rounded-lg transition-all duration-300
                        ${showCorrect
                        ? isCorrect
                            ? 'bg-success/10 border-l-4 border-l-success'
                            : 'bg-base-200'
                        : isSelected
                            ? 'bg-primary/10 border-l-4 border-l-primary'
                            : 'bg-base-200'
                    }
                    `}
                >
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                        <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${showCorrect
                            ? isCorrect
                                ? 'bg-success/20 text-success'
                                : 'bg-base-300 text-base-content/70'
                            : isSelected
                                ? 'bg-primary/20 text-primary'
                                : 'bg-base-300 text-base-content/70'
                        }
                        `}>
                            {String.fromCharCode(65 + index)}
                        </div>

                        <div className="text-center text-sm">
                            {choice}
                        </div>

                        <div className="w-6 flex justify-center">
                            {showCorrect ? (
                                isCorrect && (
                                    <div className="text-success">
                                        <BsCheckCircle className="text-lg"/>
                                    </div>
                                )
                            ) : (
                                isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);