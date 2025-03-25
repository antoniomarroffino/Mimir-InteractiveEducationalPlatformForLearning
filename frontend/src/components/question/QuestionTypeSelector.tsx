import {QuestionType} from '@dti-isin/backend-api-client';
import React from "react";
import {useQuestionCRUD} from "../../hooks/question/useQuestionCRUD.ts";

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
    const {createQuestionTemplate} = useQuestionCRUD();

    const handleTypeSelection = async (type: QuestionType) => {
        try {
            await createQuestionTemplate(type);
            onSelectType(type);
        } catch (error) {
            console.error('Failed to create question template', error);
        }
    };

    return (
        <div className="bg-base-100 rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Select Question Type</h2>
            <div className="grid grid-cols-1 gap-4">
                {Object.values(QuestionType).map(type => (
                    <button
                        key={type}
                        className="btn btn-outline btn-block"
                        onClick={() => handleTypeSelection(type)}
                        disabled={isLoading || disabled}
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : type}
                    </button>
                ))}
            </div>
        </div>
    );
};