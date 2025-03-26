import React from 'react';
import {BsPlus} from 'react-icons/bs';
import {Tooltip} from '../common/Tooltip';

interface CreateQuestionFormProps {
    onStartCreation: () => void;
    isDisabled?: boolean;
    className?: string;
}

export const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({
                                                                   onStartCreation,
                                                                   isDisabled = false,
                                                                   className = ''
                                                               }) => {
    const handleClick = () => {
        if (!isDisabled) {
            onStartCreation();
        }
    };

    const content = (
        <div
            className={`
                border-2 border-dashed border-base-300 rounded-lg 
                flex items-center justify-center 
                h-24 
                transition-all 
                ${isDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:border-primary hover:bg-base-200'}
                ${className}
            `}
            onClick={handleClick}
            role="button"
            aria-disabled={isDisabled}
        >
            <div className="flex items-center justify-center">
                <BsPlus
                    className={`
                        text-4xl 
                        ${isDisabled
                        ? 'text-base-content/40'
                        : 'text-base-content/70 group-hover:text-primary'}
                    `}
                />
            </div>
        </div>
    );

    if (isDisabled) {
        return (
            <Tooltip text="Cannot create question">
                {content}
            </Tooltip>
        );
    }

    return content;
};