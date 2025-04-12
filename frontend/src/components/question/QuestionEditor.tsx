import React, {useEffect, useMemo, useState} from 'react';
import {MultipleChoiceQuestionDTO, QuestionType, TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';
import {TrueFalseQuestionTemplate} from './TrueFalseQuestionTemplate';
import {MultipleChoiceQuestionTemplate} from './MultipleChoiceQuestionTemplate';
import {DefaultQuestionEditorScreen} from './DefaultQuestionEditorScreen';
import {SpecificQuestionDTO} from "../../hooks/question/useQuestionCreation.ts";


interface QuestionEditorProps {
    questionType: QuestionType;
    template: SpecificQuestionDTO;
    onSave: (question: SpecificQuestionDTO) => void;
    onCancel: () => void;
    onQuestionTextChange?: (text: string) => void;
    disabled?: boolean;
    isEditingExistingQuestion?: boolean;
    isPreview?: boolean;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
                                                                  questionType,
                                                                  template,
                                                                  onSave,
                                                                  onCancel,
                                                                  onQuestionTextChange,
                                                                  disabled = false,
                                                                  isEditingExistingQuestion = false,
                                                                  isPreview = false,
                                                              }) => {
    const [points, setPoints] = useState(template.points || 1);
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
        setPoints(template.points || 1);

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
                    correctAnswer,
                    points
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
                        .map(idx => choices.indexOf(choices[idx])),
                    points
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

        return isTextEmpty || disabled || isMultipleChoiceInvalid;
    }, [questionText, questionType, disabled, isQuestionValid]);

    const renderSpecificFields = () => {
        switch (questionType) {
            case QuestionType.TrueFalse:
                return (
                    <TrueFalseQuestionTemplate
                        correctAnswer={correctAnswer}
                        onCorrectAnswerChange={setCorrectAnswer}
                        disabled={disabled}
                        isPreview={isPreview}
                    />
                );
            case QuestionType.MultipleChoice:
                return (
                    <MultipleChoiceQuestionTemplate
                        choices={choices}
                        correctChoices={correctChoices}
                        onChoicesChange={setChoices}
                        onCorrectChoicesChange={setCorrectChoices}
                        disabled={disabled}
                        onValidationChange={setIsQuestionValid}
                        isPreview={isPreview}
                    />
                );
            default:
                return null;
        }
    };

    if (disabled) {
        return <DefaultQuestionEditorScreen isPreview={isPreview}/>;
    }

    return (
        <div className={`bg-base-100 rounded-lg p-6 shadow transition-all duration-200 ${disabled ? 'opacity-50' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 capitalize">
                {isPreview ? (
                    <>Previewing {questionType.toLowerCase()} Question</>
                ) : (
                    <>{isEditingExistingQuestion ? 'Edit' : 'Create'} {questionType.toLowerCase()} Question</>
                )}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-lg">Question Text</span>
                    </label>
                    <textarea
                        value={questionText}
                        onChange={handleQuestionTextChange}
                        className="textarea textarea-bordered h-24 text-lg"
                        placeholder="Enter your question"
                        required
                        disabled={disabled || isPreview}
                    />
                </div>

                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Points</span>
                        <span className="label-text-alt">
                            Points awarded for correct answer
                        </span>
                    </label>
                    <div className="join">
                        <button
                            type="button"
                            className="btn join-item"
                            onClick={() => setPoints(prev => Math.max(1, prev - 1))}
                            disabled={points <= 1 || disabled || isPreview}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={points}
                            onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
                            className="input input-bordered join-item w-20 text-center"
                            disabled={disabled || isPreview}
                        />
                        <button
                            type="button"
                            className="btn join-item"
                            onClick={() => setPoints(prev => prev + 1)}
                            disabled={disabled || isPreview}
                        >
                            +
                        </button>
                    </div>
                </div>

                {renderSpecificFields()}

                <div className="flex justify-end space-x-4">
                    {!isPreview && (
                        <>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={onCancel}
                                disabled={disabled}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSaveDisabled}
                            >
                                Save Question
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};