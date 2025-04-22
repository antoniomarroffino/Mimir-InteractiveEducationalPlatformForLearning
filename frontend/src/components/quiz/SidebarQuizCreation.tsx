import React from "react";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {QuestionsList} from "../question/QuestionList.tsx";
import {QuestionDTO} from "@dti-isin/backend-api-client";
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
            lg:col-span-3
            fixed lg:static 
            top-0 left-0 
            w-full h-full 
            lg:w-auto lg:h-auto 
            z-40 
            transform transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            overflow-y-auto
            px-4 lg:px-0
        `}>
            <div className="card bg-base-100 h-full rounded-xl">
                <div className="card-body p-4 space-y-4">
                    <div className="relative flex justify-center items-center mb-2">
                        <h2 className="text-lg font-semibold text-center">Quiz Questions</h2>
                        <button
                            className="btn btn-circle btn-sm absolute right-0 lg:hidden"
                            onClick={onCloseSidebar}
                        >
                            <XMarkIcon className="w-4 h-4"/>
                        </button>
                    </div>

                    <QuestionsList
                        questions={questions}
                        onStartEditing={onStartEditing}
                        onDeleteQuestion={onDeleteQuestion}
                    />
                </div>
            </div>
        </div>
    );
};
