import React, { useState } from 'react';
import {
    MultipleChoiceQuestionDTO,
    QuestionDTO,
    QuestionType,
    TrueFalseQuestionDTO
} from '@dti-isin/backend-api-client';
import { QuestionEditor } from './QuestionEditor';
import { BsPencil, BsTrash } from 'react-icons/bs';
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

    const renderQuestionDetails = () => {
        switch (question.type) {
            case QuestionType.TrueFalse: {
                const tfQuestion = question as TrueFalseQuestionDTO;
                return (
                    <div className="text-sm text-base-content/70 mt-1 flex items-center gap-2">
                        <Tooltip text="Correct Answer">
                            <span className={`badge ${tfQuestion.correctAnswer ? 'badge-success' : 'badge-error'}`}>
                                {tfQuestion.correctAnswer ? 'True' : 'False'}
                            </span>
                        </Tooltip>
                    </div>
                );
            }
            case QuestionType.MultipleChoice: {
                const mcQuestion = question as MultipleChoiceQuestionDTO;
                return (
                    <div className="text-sm text-base-content/70 mt-1 flex items-center gap-2">
                        <Tooltip text="Number of Choices">
                            <span className="badge badge-primary">
                                {mcQuestion.choices.length} Choices
                            </span>
                        </Tooltip>
                        <div className="flex gap-1">
                            {mcQuestion.correctAnswerIndexes.map(index => (
                                <span
                                    key={index}
                                    className="badge badge-success badge-xs"
                                >
                                    {index + 1}
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
            // Conferma eliminazione
            if (question.id) {
                onDelete?.(question.id);
            } else {
                console.warn('Cannot delete question: no ID found');
            }
            setIsConfirmingDelete(false);
        } else {
            // Mostra conferma
            setIsConfirmingDelete(true);
        }
    };

    const cancelDelete = () => {
        setIsConfirmingDelete(false);
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

    return (
        <div
            className="relative flex justify-between items-center p-3 bg-base-200 rounded
                       hover:bg-base-300 hover:shadow-md transition-all
                       cursor-pointer group"
        >
            <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{index + 1}. {question.questionText}</span>
                    <span className="badge badge-primary">
                        {question.type}
                    </span>
                </div>

                {renderQuestionDetails()}
            </div>

            <div className="flex items-center gap-2">
                {isConfirmingDelete ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-base-content/70">Confirm?</span>
                        <button
                            className="btn btn-xs btn-error"
                            onClick={handleDelete}
                        >
                            Yes
                        </button>
                        <button
                            className="btn btn-xs btn-ghost"
                            onClick={cancelDelete}
                        >
                            No
                        </button>
                    </div>
                ) : (
                    <>
                        <Tooltip text="Edit Question">
                            <button
                                className="btn btn-xs btn-ghost text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                            >
                                <BsPencil/>
                            </button>
                        </Tooltip>
                        <Tooltip text="Delete Question">
                            <button
                                className="btn btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                            >
                                <BsTrash/>
                            </button>
                        </Tooltip>
                    </>
                )}
            </div>
        </div>
    );
};