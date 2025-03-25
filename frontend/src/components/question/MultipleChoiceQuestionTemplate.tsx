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
    // Calcola il numero iniziale di scelte basato sulle choices ricevute
    const initialChoicesCount = Math.max(2, Math.min(choices.length || 2, 6));
    const [availableChoices, setAvailableChoices] = useState(initialChoicesCount);

    // Sincronizza availableChoices quando le choices cambiano esternamente
    useEffect(() => {
        const newCount = Math.max(2, Math.min(choices.length, 6));
        if (newCount !== availableChoices) {
            setAvailableChoices(newCount);
        }
    }, [choices]);

    // Effetto per gestire le risposte corrette e la validazione
    useEffect(() => {
        // Filtra le risposte corrette per mantenere solo quelle visibili
        const filteredCorrectChoices = correctChoices.filter(index => index < availableChoices);

        if (filteredCorrectChoices.length !== correctChoices.length) {
            onCorrectChoicesChange(filteredCorrectChoices);
        }

        // Validazione
        const isValid = filteredCorrectChoices.length > 0 &&
            choices.slice(0, availableChoices).some(choice => choice.trim() !== '');

        onValidationChange?.(isValid);
    }, [availableChoices, correctChoices, choices]);

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

        // Aggiungi o rimuovi elementi mantenendo i valori esistenti
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
        <div className="space-y-4">
            {/* Selettore numero di risposte */}
            <div className="flex items-center space-x-2 mb-4">
                <span>Number of Choices:</span>
                {[2, 3, 4, 5, 6].map(num => (
                    <button
                        key={num}
                        type="button"
                        className={`btn btn-xs ${availableChoices === num
                            ? 'btn-primary'
                            : 'btn-outline'}`}
                        onClick={() => updateChoiceCount(num)}
                        disabled={isLoading || disabled}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Griglia delle risposte */}
            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: availableChoices }).map((_, index) => (
                    <div key={index} className="form-control">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder={`Answer ${index + 1}`}
                                className="input input-bordered w-full"
                                value={choices[index] || ''}
                                onChange={(e) => handleChoiceChange(index, e.target.value)}
                                disabled={isLoading || disabled}
                            />
                            <button
                                type="button"
                                className={`btn ${correctChoices.includes(index)
                                    ? 'btn-primary'
                                    : 'btn-ghost'}`}
                                onClick={() => toggleCorrectChoice(index)}
                                disabled={isLoading || disabled}
                            >
                                {correctChoices.includes(index) ? (
                                    <BsCheckCircleFill />
                                ) : (
                                    <BsCircle />
                                )}
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