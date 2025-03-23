import React, { useState, useEffect } from 'react';
import {
    MultipleChoiceQuestionDTO,
    QuestionDTO,
    QuestionType,
    TrueFalseQuestionDTO
} from '@dti-isin/backend-api-client';
import { TrueFalseQuestionTemplate } from './TrueFalseQuestionTemplate';
import { MultipleChoiceQuestionTemplate } from './MultipleChoiceQuestionTemplate';

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
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
                                                                  questionType,
                                                                  template,
                                                                  onSave,
                                                                  onCancel,
                                                                  onQuestionTextChange,
                                                                  isLoading = false,
                                                                  disabled = false
                                                              }) => {
    const [questionText, setQuestionText] = useState(template.questionText || '');
    const [isQuestionValid, setIsQuestionValid] = useState(false);

    // State per True/False
    const [correctAnswer, setCorrectAnswer] = useState<boolean>(
        questionType === QuestionType.TrueFalse
            ? (template as TrueFalseQuestionDTO).correctAnswer
            : true
    );

    // State per Multiple Choice
    const [choices, setChoices] = useState<string[]>(
        questionType === QuestionType.MultipleChoice
            ? (template as MultipleChoiceQuestionDTO).choices || ['', '', '', '']
            : []
    );
    const [correctChoices, setCorrectChoices] = useState<number[]>(
        questionType === QuestionType.MultipleChoice
            ? (template as MultipleChoiceQuestionDTO).correctAnswerIndexes || []
            : []
    );

    useEffect(() => {
        if (questionType === QuestionType.TrueFalse) {
            (template as TrueFalseQuestionDTO).correctAnswer = correctAnswer;
        }
    }, [correctAnswer, template, questionType]);

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setQuestionText(text);
        onQuestionTextChange?.(text);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validazione aggiuntiva per Multiple Choice
        if (questionType === QuestionType.MultipleChoice && !isQuestionValid) {
            return;
        }

        let finalQuestion: SpecificQuestionDTO;

        switch (questionType) {
            case QuestionType.TrueFalse:
                finalQuestion = {
                    ...template,
                    questionText,
                    type: QuestionType.TrueFalse,
                    correctAnswer: correctAnswer
                } as TrueFalseQuestionDTO;
                break;

            case QuestionType.MultipleChoice:
                finalQuestion = {
                    ...template,
                    questionText,
                    type: QuestionType.MultipleChoice,
                    choices: choices,
                    correctAnswerIndexes: correctChoices
                } as MultipleChoiceQuestionDTO;
                break;

            default:
                finalQuestion = {
                    ...template,
                    questionText,
                    type: questionType
                };
        }

        onSave(finalQuestion);
    };

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

    return (
        <div className={`bg-base-100 rounded-lg p-6 shadow ${disabled ? 'opacity-50' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">
                {questionType} Question
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
                        disabled={
                            !questionText.trim() ||
                            isLoading ||
                            disabled ||
                            (questionType === QuestionType.MultipleChoice && !isQuestionValid)
                        }
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : 'Save Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};