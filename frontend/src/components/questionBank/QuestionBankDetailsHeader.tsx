import React from "react";
import {BsPencil, BsQuestionDiamond, BsTrash} from "react-icons/bs";
import {CheckIcon, XMarkIcon} from "@heroicons/react/16/solid";
import {format} from "date-fns";
import {BreadcrumbQuestionBank} from "../common/BreadcrumbQuestionBank";
import {QuestionBankDTO} from "@dti-isin/backend-api-client";
import {FiArchive} from "react-icons/fi";

interface QuestionBankDetailsHeaderProps {
    questionBankDTO: QuestionBankDTO;
    isEditing: boolean;
    newName: string;
    onEditToggle: () => void;
    onNameChange: (newName: string) => void;
    onNameSave: () => void;
    onDeleteClick: () => void;
}

export const QuestionBankDetailsHeader: React.FC<QuestionBankDetailsHeaderProps> = ({
                                                                                        questionBankDTO,
                                                                                        isEditing,
                                                                                        newName,
                                                                                        onEditToggle,
                                                                                        onNameChange,
                                                                                        onNameSave,
                                                                                        onDeleteClick
                                                                                    }) => {
    return (
        <header className="space-y-2 mb-2">
            <div
                className="bg-gradient-to-tr from-primary/5 to-base-100 border border-primary/10 p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl">
                <BreadcrumbQuestionBank questionBankDTO={questionBankDTO}/>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mt-4">
                    <div className="flex-1 flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary">
                            <FiArchive className="w-5 h-5 sm:w-6 sm:h-6"/>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                            {isEditing ? (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => onNameChange(e.target.value)}
                                        className="text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-primary focus:outline-none flex-1"
                                        autoFocus
                                    />
                                    <button
                                        onClick={onNameSave}
                                        className="btn btn-circle btn-sm btn-success"
                                        disabled={questionBankDTO.name === newName}
                                    >
                                        <CheckIcon className="w-4 h-4"/>
                                    </button>
                                    <button
                                        onClick={onEditToggle}
                                        className="btn btn-circle btn-sm btn-error"
                                    >
                                        <XMarkIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-primary truncate">
                                        {questionBankDTO.name}
                                    </h1>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-ghost btn-square hover:bg-primary/10 p-2"
                                            onClick={onEditToggle}
                                        >
                                            <BsPencil className="text-lg text-primary"/>
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-square hover:bg-error/10 p-2"
                                            onClick={onDeleteClick}
                                        >
                                            <BsTrash className="text-lg text-error"/>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60">
                                <span className="flex items-center gap-1">
                                    <BsQuestionDiamond/>
                                    {questionBankDTO.questions?.length || 0} questions
                                </span>
                                <span>•</span>
                                <span>
                                    Last modified:{" "}
                                    {format(new Date(questionBankDTO.lastModified!), "dd MMM yyyy HH:mm")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-primary/10 rounded-xl p-3 sm:p-4 text-sm text-primary/80 max-w-xs w-full sm:w-auto">
                        <p className="font-medium">💡 Quality questions create quality minds!</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
