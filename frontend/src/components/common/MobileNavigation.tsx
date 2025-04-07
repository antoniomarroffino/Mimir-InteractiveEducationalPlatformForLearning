import {XMarkIcon} from "@heroicons/react/16/solid";
import {QuizNavigation} from "../quiz/QuizNavigation.tsx";
import React from "react";
import {QuestionDTO, QuestionResponseDTO} from "@dti-isin/backend-api-client";

interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
    questions: QuestionDTO[];
    currentQuestionIndex: number;
    onQuestionChange: (index: number) => void;
    onCompleteQuiz: () => void;
    userResponses: QuestionResponseDTO[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      ...props
                                                                  }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-base-100 md:hidden">
            <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Quiz Navigation</h3>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-circle"
                        >
                            <XMarkIcon className="h-6 w-6"/>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <QuizNavigation {...props} />
                </div>
            </div>
        </div>
    );
};