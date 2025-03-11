import { QuestionType } from '@dti-isin/backend-api-client';
import React from "react";
import { questionService } from '../../services/questionService';

interface QuestionTypeSelectorProps {
    onSelectType: (type: QuestionType) => void;
    isLoading?: boolean;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
                                                                              onSelectType,
                                                                              isLoading = false
                                                                          }) => {
    const handleTypeSelection = async (type: QuestionType) => {
        try {
            // Chiama il servizio per creare il template
            await questionService.createQuestionTemplate(type);
// Passa il tipo e il template
            onSelectType(type);
        } catch (error) {
            console.error('Failed to create question template', error);
            // Gestisci l'errore (potresti voler passare un metodo di gestione errori)
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
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : type}
                    </button>
                ))}
            </div>
        </div>
    );
};