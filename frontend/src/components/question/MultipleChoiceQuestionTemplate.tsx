import React, { useState } from 'react';
import { BsCheckCircleFill, BsCircle } from 'react-icons/bs';

interface MultipleChoiceTemplateProps {
    choices: string[];
    correctChoices: number[];
    onChoicesChange: (choices: string[]) => void;
    onCorrectChoicesChange: (correctChoices: number[]) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const MultipleChoiceQuestionTemplate: React.FC<MultipleChoiceTemplateProps> = ({
                                                                                          choices,
                                                                                          correctChoices,
                                                                                          onChoicesChange,
                                                                                          onCorrectChoicesChange,
                                                                                          isLoading = false,
                                                                                          disabled = false
                                                                                      }) => {
    const [availableChoices, setAvailableChoices] = useState(4);

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        onChoicesChange(newChoices);
    };

    const toggleCorrectChoice = (index: number) => {
        const isCurrentlyCorrect = correctChoices.includes(index);

        if (isCurrentlyCorrect) {
            // Rimuovi se già selezionata
            onCorrectChoicesChange(correctChoices.filter(i => i !== index));
        } else {
            // Aggiungi se non ha raggiunto il massimo
            onCorrectChoicesChange([...correctChoices, index]);
        }
    };

    return (
        <div className="space-y-4">
            {/* Selettore numero di risposte disponibili */}
            <div className="flex items-center space-x-2 mb-4">
                <span>Number of Choices:</span>
                {[2, 3, 4, 5, 6].map(num => (
                    <button
                        key={num}
                        type="button"
                        className={`btn btn-xs ${availableChoices === num ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => {
                            setAvailableChoices(num);
                            // Aggiorna le scelte se necessario
                            const newChoices = [...choices];
                            while (newChoices.length < num) {
                                newChoices.push('');
                            }
                            onChoicesChange(newChoices.slice(0, num));
                        }}
                        disabled={isLoading || disabled}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Griglia delle risposte */}
            <div className="grid grid-cols-2 gap-4">
                {choices.slice(0, availableChoices).map((choice, index) => (
                    <div key={index} className="form-control">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder={`Answer ${index + 1}`}
                                className="input input-bordered w-full"
                                value={choice}
                                onChange={(e) => handleChoiceChange(index, e.target.value)}
                                disabled={isLoading || disabled}
                            />
                            <button
                                type="button"
                                className={`btn ${correctChoices.includes(index) ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => toggleCorrectChoice(index)}
                                disabled={isLoading || disabled}
                            >
                                {correctChoices.includes(index) ? <BsCheckCircleFill /> : <BsCircle />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};