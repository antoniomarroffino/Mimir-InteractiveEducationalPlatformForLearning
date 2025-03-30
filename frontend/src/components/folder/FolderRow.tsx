import React, {useState} from "react";
import {FolderDTO} from "@dti-isin/backend-api-client";
import {BsChevronDown, BsChevronUp, BsFolder2} from "react-icons/bs";
import {QuizList} from "../quiz/QuizList";
import {useQuizCRUD} from "../../hooks/quiz/useQuizCRUD.ts";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";
import {FiEdit2, FiPlus} from "react-icons/fi";
import {useFolderCRUD} from "../../hooks/folder/useFolderCRUD.ts";

interface FolderRowProps {
    folder: FolderDTO;
    courseId: string;
    isSelected: boolean;
    onToggleSelect: () => void;
}

export const FolderRow = ({folder, courseId, isSelected, onToggleSelect}: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [quizName, setQuizName] = useState("");
    const {createQuiz, isCreatingQuiz} = useQuizCRUD();
    const {setCurrentFolder} = useQuizSelection();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(folder.name);
    const {updateFolder, isUpdatingFolder, errorUpdateFolder} = useFolderCRUD();

    const handleNameUpdate = async () => {
        try {
            if(folder.name === editedName) {setIsEditing(false); return;}
            const folderDTO = {
                ...folder,
                name: editedName,
            } as FolderDTO;
            await updateFolder(courseId, folder.id!, folderDTO);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update folder:", error);
        }
    };

    const handleCreateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setCurrentFolder(folder.id!);

        try {
            await createQuiz(courseId!, folder.id!, {name: quizName.trim()});
            setQuizName("");
            setShowCreateForm(false);
        } catch (error) {
            console.error("Failed to create quiz:", error);
        }
    };

    const handleAddQuizClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowCreateForm(true);
        if (!isExpanded) setIsExpanded(true);
    };

    return (
        <div
            className="group bg-base-100 rounded-xl border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 ease-out">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-base-200/20 transition-colors rounded-t-xl"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggleSelect}
                        className="checkbox checkbox-primary checkbox-sm"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="flex items-center gap-4 flex-1"
                         onDoubleClick={() => setIsEditing(true)}>
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <BsFolder2 className="text-2xl"/>
                        </div>

                        {isEditing ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onBlur={handleNameUpdate}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
                                className="input input-ghost input-sm w-full max-w-xs"
                                autoFocus
                            />
                        ) : (
                            <h3 className="font-semibold text-lg">{folder.name}</h3>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isUpdatingFolder && (
                        <span className="loading loading-spinner text-primary"></span>
                    )}
                    <div className="text-base-content/40 group-hover:text-primary transition-colors">
                        {isExpanded ? <BsChevronUp/> : <BsChevronDown/>}
                    </div>
                </div>
            </div>

            {errorUpdateFolder && (
                <div className="alert alert-error mx-4 mb-4">
                    {errorUpdateFolder.message}
                </div>
            )}

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-base-200 p-4 space-y-4">
                    <QuizList courseId={courseId} folderId={folder.id!}/>

                    <div className="pt-4" onClick={(e) => e.stopPropagation()}>
                        {!showCreateForm ? (
                            <button
                                onClick={handleAddQuizClick}
                                className="btn btn-ghost w-full gap-2 border border-dashed border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/5"
                            >
                                <FiPlus className="text-lg"/>
                                Add New Quiz
                            </button>
                        ) : (
                            <form onSubmit={handleCreateQuiz} className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={quizName}
                                            onChange={(e) => setQuizName(e.target.value)}
                                            placeholder="Quiz name"
                                            className="input input-bordered w-full pl-11 focus:ring-2 focus:ring-primary/50"
                                            disabled={isCreatingQuiz}
                                            maxLength={50}
                                            autoFocus
                                        />
                                        <FiEdit2
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"/>
                                    </div>
                                    <div className="flex gap-2 sm:w-[200px]">
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-1 gap-2"
                                            disabled={isCreatingQuiz || !quizName.trim()}
                                        >
                                            {isCreatingQuiz ? (
                                                <span className="loading loading-spinner"></span>
                                            ) : (
                                                <>
                                                    <FiPlus/>
                                                    Create
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setQuizName("");
                                            }}
                                            className="btn btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-sm text-base-content/40">
                                        {quizName.length}/50 characters
                                    </span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};