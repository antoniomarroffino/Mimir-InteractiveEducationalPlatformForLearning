import React, {useState} from 'react';
import {MultipleChoiceQuestionDTO, QuestionDTO, QuestionType, TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';
import {QuestionEditor} from './QuestionEditor';
import {BsPencil, BsTrash} from 'react-icons/bs';

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

    const renderQuestionDetails = () => {
        switch (question.type) {
            case QuestionType.TrueFalse: {
                const tfQuestion = question as TrueFalseQuestionDTO;
                return (
                    <div className="text-sm text-base-content/70 mt-1">
                        Correct Answer: {tfQuestion.correctAnswer ? 'True' : 'False'}
                    </div>
                );
            }
            case QuestionType.MultipleChoice: {
                const mcQuestion = question as MultipleChoiceQuestionDTO;
                return (
                    <div className="text-sm text-base-content/70 mt-1">
                        Choices: {mcQuestion.choices.length}
                        <div className="flex gap-1 mt-1">
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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (editedQuestion: SpecificQuestionDTO) => {
        onEdit?.(editedQuestion);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleDelete = () => {
        // Aggiungi un controllo per assicurarti che l'ID esista
        if (question.id) {
            onDelete?.(question.id);
        } else {
            console.warn('Cannot delete question: no ID found');
        }
    };

    if (isEditing) {
        return (
            <QuestionEditor
                questionType={question.type}
                template={question}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <div
            className="flex justify-between items-center p-2 bg-base-200 rounded
                       hover:bg-base-300 hover:shadow-md transition-all
                       cursor-pointer group"
            onClick={handleEdit}
        >
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{index + 1}. {question.questionText}</span>
                    <span className="badge badge-primary">
                        {question.type}
                    </span>
                </div>

                {renderQuestionDetails()}
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="btn btn-xs btn-ghost text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                    }}
                >
                    <BsPencil/>
                </button>
                <button
                    className="btn btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <BsTrash/>
                </button>
            </div>
        </div>
    );
};