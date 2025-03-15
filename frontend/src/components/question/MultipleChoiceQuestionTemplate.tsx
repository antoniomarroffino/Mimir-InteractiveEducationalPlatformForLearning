import React, { useState, useEffect } from 'react';
import { BsCheckCircleFill, BsCircle } from 'react-icons/bs';

interface MultipleChoiceTemplateProps {
    choices: string[];
    correctChoices: number[];
    onChoicesChange: (choices: string[]) => void;
    onCorrectChoicesChange: (correctChoices: number[]) => void;
    isLoading?: boolean;
    disabled?: boolean;
    onValidationChange?: (isValid: boolean) => void;
}

export const MultipleChoiceQuestionTemplate: React.FC<MultipleChoiceTemplateProps> = ({
                                                                                          choices,
                                                                                          correctChoices,
                                                                                          onChoicesChange,
                                                                                          onCorrectChoicesChange,
                                                                                          isLoading = false,
                                                                                          disabled = false,
                                                                                          onValidationChange
                                                                                      }) => {
    const [availableChoices, setAvailableChoices] = useState(4);

    // Effetto per impostare le 4 scelte di default all'inizio
    useEffect(() => {
        const initialChoices = Array(4).fill('');
        onChoicesChange(initialChoices);
    }, [onChoicesChange]);

    // Effetto per gestire le risposte corrette quando cambiano le scelte disponibili
    useEffect(() => {
        // Filtra le risposte corrette per mantenere solo quelle visibili
        const filteredCorrectChoices = correctChoices.filter(index => index < availableChoices);

        // Se le risposte corrette sono cambiate, aggiorna
        if (filteredCorrectChoices.length !== correctChoices.length) {
            onCorrectChoicesChange(filteredCorrectChoices);
        }
    }, [availableChoices, correctChoices, onCorrectChoicesChange]);

    useEffect(() => {
        const isValid = correctChoices.length > 0 &&
            choices.slice(0, availableChoices).some(choice => choice.trim() !== '');

        onValidationChange?.(isValid);
    }, [correctChoices, choices, availableChoices, onValidationChange]);

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
            // Aggiungi
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
                            // Assicura che ci siano abbastanza scelte
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

            {/* Messaggio di validazione */}
            {correctChoices.length === 0 && (
                <div className="text-error text-sm mt-2">
                    Please select at least one correct answer
                </div>
            )}
        </div>
    );
};