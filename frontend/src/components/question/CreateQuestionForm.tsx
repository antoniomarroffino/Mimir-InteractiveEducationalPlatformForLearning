import React from 'react';
import { BsPlus } from 'react-icons/bs';

interface CreateQuestionFormProps {
    onStartCreation: () => void;
    isDisabled?: boolean;
}

const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({
                                                                   onStartCreation,
                                                                   isDisabled = false
                                                               }) => {
    return (
        <div
            className={`
                border-2 border-dashed border-base-300 rounded-lg 
                flex items-center justify-center 
                h-24 cursor-pointer hover:border-primary 
                transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={!isDisabled ? onStartCreation : undefined}
        >
            <div className="flex items-center justify-center">
                <BsPlus className="text-4xl text-base-content/70 group-hover:text-primary" />
            </div>
        </div>
    );
};

export default CreateQuestionForm;