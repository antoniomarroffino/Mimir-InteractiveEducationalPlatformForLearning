import React, { useState } from 'react';
import { QuestionDTO, QuestionType } from '@dti-isin/backend-api-client';

interface QuestionEditorProps {
    questionType: QuestionType;
    template: QuestionDTO;
    onSave: (question: QuestionDTO) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
                                                                  questionType,
                                                                  template,
                                                                  onSave,
                                                                  onCancel,
                                                                  isLoading = false
                                                              }) => {
    const [questionText, setQuestionText] = useState(template.questionText || '');
    const [correctAnswer, setCorrectAnswer] = useState<boolean>(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalQuestion: QuestionDTO = {
            ...template,
            questionText,
            type: questionType,
            correctAnswer: questionType === QuestionType.TrueFalse ? correctAnswer : undefined
        };

        onSave(finalQuestion);
    };

    return (
        <div className="bg-base-100 rounded-lg p-6 shadow">
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
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="textarea textarea-bordered h-24"
                        placeholder="Enter your question"
                        required
                        disabled={isLoading}
                    />
                </div>

                {questionType === QuestionType.TrueFalse && (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Correct Answer</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <span>True</span>
                            <input
                                type="radio"
                                className="radio"
                                checked={correctAnswer === true}
                                onChange={() => setCorrectAnswer(true)}
                                disabled={isLoading}
                            />
                            <span>False</span>
                            <input
                                type="radio"
                                className="radio"
                                checked={correctAnswer === false}
                                onChange={() => setCorrectAnswer(false)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!questionText.trim() || isLoading}
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : 'Save Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};