import React from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { QuestionsList } from "../question/QuestionList.tsx";
import { QuestionDTO } from "@dti-isin/backend-api-client";
import {SpecificQuestionDTO} from "../../hooks/question/useQuestionCreation.ts";

interface SidebarQuizCreationProps {
    isSidebarOpen: boolean;
    onCloseSidebar: () => void;
    questions: QuestionDTO[];
    onStartEditing: (question: SpecificQuestionDTO) => void;
    onDeleteQuestion: (questionId: string) => void;
}

export const SidebarQuizCreation: React.FC<SidebarQuizCreationProps> = ({
                                                                            isSidebarOpen,
                                                                            onCloseSidebar,
                                                                            questions,
                                                                            onStartEditing,
                                                                            onDeleteQuestion,
                                                                        }) => {
    return (
        <div className={`
            lg:col-span-3 fixed lg:static top-0 left-0 w-full h-full lg:w-auto lg:h-auto z-40 
            transform transition-transform duration-300 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 bg-base-100/95 backdrop-blur-sm lg:bg-transparent p-6 lg:p-0 overflow-y-auto
        `}>
            <div className="bg-base-100 rounded-xl p-6 shadow-xl space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Quiz Questions</h3>
                    <button
                        className="btn btn-circle btn-sm lg:hidden"
                        onClick={onCloseSidebar}
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
                <QuestionsList
                    questions={questions}
                    onStartEditing={onStartEditing}
                    onDeleteQuestion={onDeleteQuestion}
                />
            </div>
        </div>
    );
};
