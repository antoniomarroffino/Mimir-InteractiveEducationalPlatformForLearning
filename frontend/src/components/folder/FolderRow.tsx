import React, {useState} from "react";
import {FolderDTO} from "@dti-isin/backend-api-client";
import {BsChevronDown, BsChevronUp, BsFolder2, BsPlus} from "react-icons/bs";
import {QuizList} from "../quiz/QuizList";
import {useQuizCRUD} from "../../hooks/quiz/useQuizCRUD.ts";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";
import {useQuizSelection} from "../../hooks/quiz/useQuizSelection.ts";

interface FolderRowProps {
    folder: FolderDTO;
    courseId: string;
}

export const FolderRow = ({folder, courseId}: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [quizName, setQuizName] = useState("");
    const {createQuiz, isCreatingQuiz} = useQuizCRUD();
    const {setSelectedFolderId, setSelectedFolder} = useFolderSelection();
    const {setCurrentFolder} = useQuizSelection();

    const handleCreateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Imposta la cartella SOLO quando si sta creando un quiz
        setCurrentFolder(folder.id!);
        setSelectedFolderId(folder.id!);
        setSelectedFolder(folder);

        try {
            await createQuiz(folder.id!, quizName.trim());
            setQuizName("");
            setShowCreateForm(false);
        } catch (error) {
            console.error("Failed to create quiz", error);
        }
    };

    const handleAddQuizClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Apri il form di creazione
        setShowCreateForm(true);

        // Espandi la cartella se non è già espansa
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    return (
        <div className="bg-base-100 shadow-sm hover:shadow-md transition-all">
            <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <BsFolder2 className="text-xl text-primary"/>
                    <h3 className="font-semibold">{folder.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-base-content/70">
                        open to see quizzes
                    </span>
                    {isExpanded ? <BsChevronUp/> : <BsChevronDown/>}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-base-200 p-4">
                    <QuizList
                        courseId={courseId}
                        folderId={folder.id!}
                    />

                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        {!showCreateForm ? (
                            <button
                                onClick={handleAddQuizClick}
                                className="btn btn-primary w-full"
                                disabled={isCreatingQuiz}
                            >
                                <BsPlus className="text-xl mr-2"/>
                                Add New Quiz
                            </button>
                        ) : (
                            <form onSubmit={handleCreateQuiz} className="space-y-2">
                                <input
                                    type="text"
                                    value={quizName}
                                    onChange={(e) => setQuizName(e.target.value)}
                                    placeholder="Enter quiz name"
                                    className="input input-bordered w-full"
                                    disabled={isCreatingQuiz}
                                    maxLength={50}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1"
                                        disabled={isCreatingQuiz || !quizName.trim()}
                                    >
                                        {isCreatingQuiz ? "Creating..." : "Create Quiz"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCreateForm(false);
                                            setQuizName("");
                                        }}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};