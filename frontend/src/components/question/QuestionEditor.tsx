import React, { useEffect, useState, useMemo } from 'react';
import {
    MultipleChoiceQuestionDTO,
    QuestionDTO,
    QuestionType,
    TrueFalseQuestionDTO
} from '@dti-isin/backend-api-client';
import { TrueFalseQuestionTemplate } from './TrueFalseQuestionTemplate';
import { MultipleChoiceQuestionTemplate } from './MultipleChoiceQuestionTemplate';
import { DefaultQuestionEditorScreen } from './DefaultQuestionEditorScreen';

type SpecificQuestionDTO =
    | QuestionDTO
    | TrueFalseQuestionDTO
    | MultipleChoiceQuestionDTO;

interface QuestionEditorProps {
    questionType: QuestionType;
    template: SpecificQuestionDTO;
    onSave: (question: SpecificQuestionDTO) => void;
    onCancel: () => void;
    onQuestionTextChange?: (text: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
    isEditingExistingQuestion?: boolean;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
                                                                  questionType,
                                                                  template,
                                                                  onSave,
                                                                  onCancel,
                                                                  onQuestionTextChange,
                                                                  isLoading = false,
                                                                  disabled = false,
                                                                  isEditingExistingQuestion = false,
                                                              }) => {
    const [questionText, setQuestionText] = useState(template.questionText || '');
    const [isQuestionValid, setIsQuestionValid] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState<boolean>(
        (template as TrueFalseQuestionDTO).correctAnswer ?? true
    );
    const [choices, setChoices] = useState<string[]>(
        (template as MultipleChoiceQuestionDTO).choices ?? ['', '']
    );
    const [correctChoices, setCorrectChoices] = useState<number[]>(
        (template as MultipleChoiceQuestionDTO).correctAnswerIndexes ?? []
    );

    useEffect(() => {
        setQuestionText(template.questionText || '');

        if (questionType === QuestionType.TrueFalse) {
            setCorrectAnswer((template as TrueFalseQuestionDTO).correctAnswer ?? true);
        } else if (questionType === QuestionType.MultipleChoice) {
            const mcTemplate = template as MultipleChoiceQuestionDTO;
            setChoices(mcTemplate.choices ?? ['', '']);
            setCorrectChoices(mcTemplate.correctAnswerIndexes ?? []);
        }
    }, [template, questionType]);

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setQuestionText(text);
        onQuestionTextChange?.(text);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalQuestion: SpecificQuestionDTO;

        switch (questionType) {
            case QuestionType.TrueFalse:
                finalQuestion = {
                    ...template,
                    questionText: questionText?.trim(),
                    type: QuestionType.TrueFalse,
                    correctAnswer
                };
                break;

            case QuestionType.MultipleChoice:
                finalQuestion = {
                    ...template,
                    questionText: questionText?.trim(),
                    type: QuestionType.MultipleChoice,
                    choices: choices.filter(c => c.trim() !== ''),
                    correctAnswerIndexes: correctChoices
                        .filter(idx => idx < choices.length && choices[idx].trim() !== '')
                        .map(idx => choices.indexOf(choices[idx]))
                };
                break;

            default:
                finalQuestion = template;
        }

        onSave(finalQuestion);
    };

    const isSaveDisabled = useMemo(() => {
        const isTextEmpty = !questionText?.trim();
        const isMultipleChoiceInvalid =
            questionType === QuestionType.MultipleChoice && !isQuestionValid;

        return isTextEmpty || isLoading || disabled || isMultipleChoiceInvalid;
    }, [questionText, questionType, isLoading, disabled, isQuestionValid]);

    const renderSpecificFields = () => {
        switch (questionType) {
            case QuestionType.TrueFalse:
                return (
                    <TrueFalseQuestionTemplate
                        correctAnswer={correctAnswer}
                        onCorrectAnswerChange={setCorrectAnswer}
                        isLoading={isLoading}
                        disabled={disabled}
                    />
                );
            case QuestionType.MultipleChoice:
                return (
                    <MultipleChoiceQuestionTemplate
                        choices={choices}
                        correctChoices={correctChoices}
                        onChoicesChange={setChoices}
                        onCorrectChoicesChange={setCorrectChoices}
                        isLoading={isLoading}
                        disabled={disabled}
                        onValidationChange={setIsQuestionValid}
                    />
                );
            default:
                return null;
        }
    };

    if (disabled) {
        return <DefaultQuestionEditorScreen />;
    }

    return (
        <div className={`bg-base-100 rounded-lg p-6 shadow ${disabled ? 'opacity-50' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 capitalize">
                {isEditingExistingQuestion ? 'Edit' : 'Create'} {questionType.toLowerCase()} Question
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Question Text</span>
                    </label>
                    <textarea
                        value={questionText}
                        onChange={handleQuestionTextChange}
                        className="textarea textarea-bordered h-24"
                        placeholder="Enter your question"
                        required
                        disabled={isLoading || disabled}
                    />
                </div>

                {renderSpecificFields()}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onCancel}
                        disabled={isLoading || disabled}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSaveDisabled}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : 'Save Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};