import React from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { BreadcrumbCourses } from "../course/BreadcrumbCourses";
import { CourseDTO } from "@dti-isin/backend-api-client";
import { LeaveCourseButton } from "../course/LeaveCourseButton";

interface CourseDetailsHeaderProps {
    course: CourseDTO;
    isEditing: boolean;
    newName: string;
    onEditToggle: () => void;
    onNameChange: (newName: string) => void;
    onNameSave: () => void;
    onDeleteClick: () => void;
    onLeaveClick: () => void;
    editedDescription: string;
    onDescriptionChange: (value: string) => void;
    onCancelEdit: () => void;
}

export const CourseDetailsHeader: React.FC<CourseDetailsHeaderProps> = ({
                                                                            course,
                                                                            isEditing,
                                                                            newName,
                                                                            onEditToggle,
                                                                            onNameChange,
                                                                            onNameSave,
                                                                            onDeleteClick,
                                                                            onLeaveClick,
                                                                            editedDescription,
                                                                            onDescriptionChange,
                                                                            onCancelEdit,
                                                                        }) => {
    const hasChanges =
        newName.trim() !== course.name.trim() ||
        (editedDescription.trim() !== (course.description?.trim() || ""));

    return (
        <header className="space-y-2 mb-2">
            <div className="bg-gradient-to-tr from-primary/5 to-base-100 border border-primary/10 p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl">
                <BreadcrumbCourses course={course} />
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mt-4">
                    <div className="flex-1 space-y-3">
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
                                    disabled={!hasChanges}
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onCancelEdit}
                                    className="btn btn-circle btn-sm btn-error"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary truncate">
                                    {course.name}
                                </h1>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-ghost btn-square hover:bg-primary/10 p-2"
                                        onClick={onEditToggle}
                                    >
                                        <BsPencil className="text-lg text-primary" />
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-square hover:bg-error/10 p-2"
                                        onClick={onDeleteClick}
                                    >
                                        <BsTrash className="text-lg text-error" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="text-left">
                            {isEditing ? (
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => onDescriptionChange(e.target.value)}
                                    className="textarea textarea-ghost w-full text-sm sm:text-base border-none focus:outline-none placeholder:text-base-content/40"
                                    placeholder="✍️ Type course description here..."
                                    rows={2}
                                />
                            ) : (
                                <p className="text-base-content/60 text-sm italic">
                                    {course.description || "No description provided"}
                                </p>
                            )}
                        </div>
                    </div>

                    <LeaveCourseButton onClick={onLeaveClick} />
                </div>
            </div>
        </header>
    );
};
