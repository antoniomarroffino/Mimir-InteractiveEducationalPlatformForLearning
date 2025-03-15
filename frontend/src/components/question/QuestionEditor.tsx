import React, { useState, useEffect } from 'react';
import {
    QuestionDTO,
    QuestionType,
    TrueFalseQuestionDTO
} from '@dti-isin/backend-api-client';

type SpecificQuestionDTO =
    | QuestionDTO
    | TrueFalseQuestionDTO

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
    const [correctAnswer, setCorrectAnswer] = useState<boolean>(
        questionType === QuestionType.TrueFalse
            ? (template as TrueFalseQuestionDTO).correctAnswer
            : true
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

        const finalQuestion: SpecificQuestionDTO = {
            ...template,
            questionText,
            type: questionType
        };

        switch(questionType) {
            case QuestionType.TrueFalse:
                (finalQuestion as TrueFalseQuestionDTO).correctAnswer = correctAnswer;
                break;
        }

        onSave(finalQuestion);
    };

    const renderSpecificFields = () => {
        switch(questionType) {
            case QuestionType.TrueFalse: {
                return (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Correct Answer</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <span>True</span>
                            <input
                                type="radio"
                                className="radio"
                                checked={correctAnswer}
                                onChange={() => setCorrectAnswer(true)}
                                disabled={isLoading}
                            />
                            <span>False</span>
                            <input
                                type="radio"
                                className="radio"
                                checked={!correctAnswer}
                                onChange={() => setCorrectAnswer(false)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                );
            }
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
                        disabled={!questionText.trim() || isLoading || disabled}
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : 'Save Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};