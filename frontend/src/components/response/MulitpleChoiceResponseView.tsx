import {BsCheckCircle} from "react-icons/bs";

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
                                                                                          showCorrect = false // Di default non mostriamo le risposte corrette
                                                                                      }) => (
    <div className="grid gap-3">
        {choices.map((choice, index) => {
            const isSelected = selectedIndexes.includes(index);
            const isCorrect = correctIndexes.includes(index);

            return (
                <div
                    key={index}
                    className={`
                        p-4 rounded-lg flex items-center gap-3 border transition-all
                        ${showCorrect
                        ? isCorrect
                            ? 'bg-success/10 border-success'
                            : 'bg-base-200 border-base-200'
                        : isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'bg-base-200 border-base-200'
                    }
                    `}
                >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        {showCorrect ? (
                            isCorrect && <BsCheckCircle className="text-xl text-success" />
                        ) : (
                            isSelected && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                            )
                        )}
                    </div>
                    <div className="flex-1">
                        <span className="font-medium">
                            {choice}
                        </span>
                    </div>
                </div>
            );
        })}
    </div>
);