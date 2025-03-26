import React, { useState } from 'react';
import {
    MultipleChoiceQuestionDTO,
    QuestionDTO,
    QuestionType,
    TrueFalseQuestionDTO
} from '@dti-isin/backend-api-client';
import { QuestionEditor } from './QuestionEditor';
import {
    BsPencil,
    BsTrash,
    BsLightbulb,
    BsCheckCircle,
    BsXCircle,
    BsListCheck,
    BsToggleOn
} from 'react-icons/bs';
import { Tooltip } from '../common/Tooltip';

type SpecificQuestionDTO =
    | QuestionDTO
    | TrueFalseQuestionDTO
    | MultipleChoiceQuestionDTO;

interface QuestionElementProps {
    question: SpecificQuestionDTO;
    index: number;
    onEdit?: (question: SpecificQuestionDTO) => void;
    onDelete?: (questionId: string) => void;
}

export const QuestionElement: React.FC<QuestionElementProps> = ({
                                                                    question,
                                                                    index,
                                                                    onEdit,
                                                                    onDelete
                                                                }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const getQuestionTypeStyles = () => {
        switch (question.type) {
            case QuestionType.TrueFalse:
                return {
                    icon: <BsToggleOn className="text-green-600" />,
                    borderColor: 'border-green-500',
                    bgColor: 'bg-green-200',
                    textColor: 'text-green-700'
                };
            case QuestionType.MultipleChoice:
                return {
                    icon: <BsListCheck className="text-blue-600" />,
                    borderColor: 'border-blue-500',
                    bgColor: 'bg-blue-200',
                    textColor: 'text-blue-700'
                };
            default:
                return {
                    icon: null,
                    borderColor: 'border-gray-300',
                    bgColor: 'bg-gray-50',
                    textColor: 'text-gray-700'
                };
        }
    };

    const renderQuestionDetails = () => {
        switch (question.type) {
            case QuestionType.TrueFalse: {
                const tfQuestion = question as TrueFalseQuestionDTO;
                return (
                    <div className="flex items-center gap-2 text-xs">
                        {tfQuestion.correctAnswer ? (
                            <BsCheckCircle className="text-success" />
                        ) : (
                            <BsXCircle className="text-error" />
                        )}
                        <span className="text-base-content/70">
                            {tfQuestion.correctAnswer ? 'True' : 'False'}
                        </span>
                    </div>
                );
            }
            case QuestionType.MultipleChoice: {
                const mcQuestion = question as MultipleChoiceQuestionDTO;
                return (
                    <div className="flex items-center gap-2 text-xs">
                        <BsLightbulb className="text-warning" />
                        <span className="text-base-content/70">
                            {mcQuestion.choices.length} Choices
                        </span>
                        <div className="flex gap-1">
                            {mcQuestion.correctAnswerIndexes.map(idx => (
                                <span
                                    key={idx}
                                    className="w-4 h-4 rounded-full bg-success/50 text-white flex items-center justify-center text-[0.5rem]"
                                >
                                    {idx + 1}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            }
            default:
                return null;
        }
    };

    const handleDelete = () => {
        if (isConfirmingDelete) {
            if (question.id) {
                onDelete?.(question.id);
            } else {
                console.warn('Cannot delete question: no ID found');
            }
            setIsConfirmingDelete(false);
        } else {
            setIsConfirmingDelete(true);
        }
    };

    if (isEditing) {
        return (
            <QuestionEditor
                questionType={question.type}
                template={question}
                onSave={(editedQuestion) => {
                    onEdit?.(editedQuestion);
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    const typeStyles = getQuestionTypeStyles();

    return (
        <div
            className={`
                relative 
                p-3 
                rounded-lg 
                bg-base-100 
                border 
                ${typeStyles.borderColor}
                shadow-sm
                hover:shadow-md
                transition-all
                group
                cursor-pointer
                flex
                items-start
            `}
            onClick={() => setIsEditing(true)}
        >
            {/* Indicatore laterale */}
            <div
                className={`
                    absolute 
                    left-0 
                    top-0 
                    bottom-0 
                    w-1.5 
                    rounded-l-lg 
                    ${typeStyles.bgColor}
                    ${typeStyles.borderColor}
                `}
            />

            <div className="flex items-start w-full pl-3">
                <div className="mr-3 mt-1">
                    {typeStyles.icon}
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-semibold line-clamp-1 ${typeStyles.textColor}`}>
                            {index + 1}. {question.questionText}
                        </span>
                    </div>

                    {renderQuestionDetails()}
                </div>

                <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isConfirmingDelete ? (
                        <div className="flex items-center gap-1">
                            <Tooltip text="Confirm Delete">
                                <button
                                    className="btn btn-xs btn-error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                >
                                    <BsTrash className="text-xs" />
                                </button>
                            </Tooltip>
                            <Tooltip text="Cancel">
                                <button
                                    className="btn btn-xs btn-ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsConfirmingDelete(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </Tooltip>
                        </div>
                    ) : (
                        <>
                            <Tooltip text="Edit Question">
                                <button
                                    className="btn btn-xs btn-ghost text-base-content/70 hover:text-primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                >
                                    <BsPencil className="text-xs" />
                                </button>
                            </Tooltip>
                            <Tooltip text="Delete Question">
                                <button
                                    className="btn btn-xs btn-ghost text-base-content/70 hover:text-error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsConfirmingDelete(true);
                                    }}
                                >
                                    <BsTrash className="text-xs" />
                                </button>
                            </Tooltip>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};