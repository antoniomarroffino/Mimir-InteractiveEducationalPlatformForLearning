import React from "react";
import {SpecificQuestionDTO} from "../../hooks/question/useQuestionCreation";
import {QuestionType} from "@dti-isin/backend-api-client";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {QuestionsList} from "./QuestionList.tsx";
import {DraftQuestionElement} from "./DraftQuestionElement.tsx";

interface SidebarQuestionListProps {
    isSidebarOpen: boolean;
    onClose: () => void;
    questions: SpecificQuestionDTO[];
    onStartEditing: (question: SpecificQuestionDTO) => void;
    onDeleteQuestion: (questionId: string) => void;
    onReorder: (reorderedQuestions: SpecificQuestionDTO[]) => void;
    onStartCreation: () => void;
    draftQuestion?: Partial<SpecificQuestionDTO>;
    selectedQuestionType?: QuestionType;
    isCreatingQuestion: boolean;
}

export const SidebarQuestionList: React.FC<SidebarQuestionListProps> = ({
                                                                            isSidebarOpen,
                                                                            onClose,
                                                                            questions,
                                                                            onStartEditing,
                                                                            onDeleteQuestion,
                                                                            onReorder,
                                                                            onStartCreation,
                                                                            draftQuestion,
                                                                            selectedQuestionType,
                                                                            isCreatingQuestion,
                                                                        }) => {
    return (
        <div className={`
            lg:col-span-4
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
                <div className="card-body p-4">
                    <div className="relative flex justify-center items-center mb-2">
                        <h2 className="text-lg font-semibold text-center">Questions</h2>
                        <button
                            className="btn btn-circle btn-sm absolute right-0 lg:hidden"
                            onClick={onClose}
                        >
                            <XMarkIcon className="w-4 h-4"/>
                        </button>
                    </div>


                    <QuestionsList
                        questions={questions}
                        onStartEditing={onStartEditing}
                        onDeleteQuestion={onDeleteQuestion}
                        onReorder={onReorder}
                        onStartCreation={onStartCreation}
                        draftQuestionElement={
                            isCreatingQuestion && draftQuestion?.questionText && selectedQuestionType ? (
                                <DraftQuestionElement
                                    questionText={draftQuestion.questionText}
                                    questionType={selectedQuestionType}
                                />
                            ) : undefined
                        }
                    />
                </div>
            </div>
        </div>
    );
};
