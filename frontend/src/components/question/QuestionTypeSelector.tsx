import {QuestionType} from '@dti-isin/backend-api-client';
import React from "react";
import {BsCheckCircle, BsListCheck, BsQuestionCircle} from 'react-icons/bs';
import {useQuestionCRUD} from "../../hooks/question/useQuestionCRUD.ts";
import {Tooltip} from '../common/Tooltip';

interface QuestionTypeSelectorProps {
    onSelectType: (type: QuestionType) => void;
    isLoading?: boolean;
    disabled?: boolean;
    currentType?: QuestionType | null;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
                                                                              onSelectType,
                                                                              isLoading = false,
                                                                              disabled = false,
                                                                              currentType = null
                                                                          }) => {
    const {createQuestionTemplate} = useQuestionCRUD();

    const getTypeDetails = (type: QuestionType) => {
        switch (type) {
            case QuestionType.TrueFalse:
                return {
                    icon: BsCheckCircle,
                    description: "Simple yes or no questions",
                    gradient: "from-green-200 to-green-300"
                };
            case QuestionType.MultipleChoice:
                return {
                    icon: BsListCheck,
                    description: "Questions with multiple options",
                    gradient: "from-blue-200 to-blue-300"
                };
            default:
                return {
                    icon: BsQuestionCircle,
                    description: "Unknown question type",
                    gradient: "from-gray-200 to-gray-300"
                };
        }
    };

    const handleTypeSelection = async (type: QuestionType) => {
        try {
            await createQuestionTemplate(type);
            onSelectType(type);
        } catch (error) {
            console.error('Failed to create question template', error);
        }
    };

    return (
        <div
            className={`
                bg-base-100 
                rounded-lg 
                p-6 
                shadow 
                ${disabled ? 'opacity-50' : ''}
            `}
        >
            <h2 className="text-2xl font-bold mb-6 text-base-content/80">
                Choose Question Type
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {Object.values(QuestionType).map(type => {
                    const isTypeSelected = currentType === type;
                    const {icon: Icon, description, gradient} = getTypeDetails(type);

                    const typeButton = (
                        <div
                            key={type}
                            className={`
                                p-4 
                                rounded-lg 
                                bg-gradient-to-br 
                                ${gradient}
                                shadow-md
                                hover:shadow-lg
                                transition-all
                                cursor-pointer
                                ${isTypeSelected ? 'ring-4 ring-primary/50' : ''}
                            `}
                            onClick={() => handleTypeSelection(type)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon
                                            className={`
                                                text-2xl 
                                                ${isTypeSelected
                                                ? 'text-primary'
                                                : 'text-base-content/70'}
                                            `}
                                        />
                                        <span className="text-lg font-semibold">
                                            {type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-base-content/60">
                                        {description}
                                    </p>
                                </div>
                                {isLoading && isTypeSelected && (
                                    <span className="loading loading-spinner text-primary"></span>
                                )}
                            </div>
                        </div>
                    );

                    if (disabled) {
                        return (
                            <Tooltip key={type} text="Cannot select question type">
                                {typeButton}
                            </Tooltip>
                        );
                    }

                    return typeButton;
                })}
            </div>
        </div>
    );
};