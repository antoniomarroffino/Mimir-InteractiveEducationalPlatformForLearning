import { QuestionType } from '@dti-isin/backend-api-client';
import React, { useState } from "react";
import { useQuestionCRUD } from "../../hooks/question/useQuestionCRUD.ts";
import { Tooltip } from '../common/Tooltip';

interface QuestionTypeSelectorProps {
    onSelectType: (type: QuestionType) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
                                                                              onSelectType,
                                                                              isLoading = false,
                                                                              disabled = false
                                                                          }) => {
    const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
    const { createQuestionTemplate } = useQuestionCRUD();

    const handleTypeSelection = async (type: QuestionType) => {
        try {
            await createQuestionTemplate(type);
            setSelectedType(type);
            onSelectType(type);
        } catch (error) {
            console.error('Failed to create question template', error);
            // Potrebbe essere utile mostrare un toast o un messaggio di errore
        }
    };

    return (
        <div className={`bg-base-100 rounded-lg p-4 shadow ${disabled ? 'opacity-50' : ''}`}>
            <h2 className="text-lg font-semibold mb-4">Select Question Type</h2>
            <div className="grid grid-cols-1 gap-4">
                {Object.values(QuestionType).map(type => {
                    const isTypeSelected = selectedType === type;

                    const button = (
                        <button
                            key={type}
                            className={`
                                btn btn-block 
                                ${isTypeSelected
                                ? 'btn-primary'
                                : 'btn-outline'}
                            `}
                            onClick={() => handleTypeSelection(type)}
                            disabled={isLoading || disabled || isTypeSelected}
                        >
                            {isLoading && isTypeSelected
                                ? <span className="loading loading-spinner"></span>
                                : type}
                        </button>
                    );

                    if (disabled) {
                        return (
                            <Tooltip key={type} text="Cannot select question type">
                                {button}
                            </Tooltip>
                        );
                    }

                    return button;
                })}
            </div>
        </div>
    );
};