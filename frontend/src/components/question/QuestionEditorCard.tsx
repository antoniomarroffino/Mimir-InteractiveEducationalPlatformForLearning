import React from "react";
import {QuestionType} from "@dti-isin/backend-api-client";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {QuestionEditor} from "./QuestionEditor";
import {SpecificQuestionDTO} from "../../hooks/question/useQuestionCreation";

interface QuestionEditorCardProps {
    isCreatingQuestion: boolean;
    selectedQuestionType: QuestionType | undefined | null;
    questionTemplate: SpecificQuestionDTO;
    isEditingExistingQuestion: boolean;
    onCancel: () => void;
    onSave: (q: SpecificQuestionDTO) => void;
    onQuestionTextChange: (text: string) => void;
}

export const QuestionEditorCard: React.FC<QuestionEditorCardProps> = ({
                                                                          isCreatingQuestion,
                                                                          selectedQuestionType,
                                                                          questionTemplate,
                                                                          isEditingExistingQuestion,
                                                                          onCancel,
                                                                          onSave,
                                                                          onQuestionTextChange,
                                                                      }) => {
    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="card-title">
                        {isCreatingQuestion ? "New Question" : "Question Editor"}
                    </h3>
                    {isCreatingQuestion && (
                        <button
                            onClick={onCancel}
                            className="btn btn-outline btn-secondary gap-2 hover:bg-secondary/10"
                        >
                            <XMarkIcon className="w-5 h-5"/>
                            Discard Draft
                        </button>
                    )}
                </div>

                <QuestionEditor
                    questionType={selectedQuestionType || QuestionType.TrueFalse}
                    template={questionTemplate}
                    onSave={onSave}
                    onCancel={onCancel}
                    onQuestionTextChange={onQuestionTextChange}
                    disabled={!isCreatingQuestion || !selectedQuestionType}
                    isEditingExistingQuestion={isEditingExistingQuestion}
                />
            </div>
        </div>
    );
};
