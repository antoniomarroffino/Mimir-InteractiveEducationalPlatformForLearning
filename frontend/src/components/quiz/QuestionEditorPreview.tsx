import React from "react";
import { QuestionEditor } from "../question/QuestionEditor";
import { QuestionType } from "@dti-isin/backend-api-client";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { SpecificQuestionDTO } from "../../hooks/question/useQuestionCreation";

interface QuestionEditorPreviewProps {
    questionTemplate: SpecificQuestionDTO;
    selectedQuestionType: QuestionType | null;
    isEditingExistingQuestion: boolean;
    onSave: (question: SpecificQuestionDTO) => void;
    onCancel: () => void;
    onQuestionTextChange: (text: string) => void;
    isDisabled: boolean;
}

export const QuestionEditorPreview: React.FC<QuestionEditorPreviewProps> = ({
                                                                                questionTemplate,
                                                                                selectedQuestionType,
                                                                                isEditingExistingQuestion,
                                                                                onSave,
                                                                                onCancel,
                                                                                onQuestionTextChange,
                                                                                isDisabled,
                                                                            }) => {
    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="card-title">Question Preview</h3>
                    {selectedQuestionType && (
                        <button type="button" className="btn btn-error gap-2" onClick={onCancel}>
                            <XMarkIcon className="h-5 w-5" />
                            Exit Preview
                        </button>
                    )}
                </div>
                <QuestionEditor
                    questionType={selectedQuestionType || QuestionType.TrueFalse}
                    template={questionTemplate}
                    onSave={onSave}
                    onCancel={onCancel}
                    onQuestionTextChange={onQuestionTextChange}
                    disabled={isDisabled}
                    isEditingExistingQuestion={isEditingExistingQuestion}
                    isPreview={true}
                />
            </div>
        </div>
    );
};