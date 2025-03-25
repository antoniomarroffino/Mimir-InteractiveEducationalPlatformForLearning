import React, {useState} from "react";
import {FolderDTO} from "@dti-isin/backend-api-client";
import {BsChevronDown, BsChevronUp, BsFolder2, BsPlus} from "react-icons/bs";
import {QuizList} from "../quiz/QuizList";
import {useQuiz} from "../../hooks/useQuiz.ts";
import {useQueryClient} from "react-query";

interface FolderRowProps {
    folder: FolderDTO;
    courseId: string;
}

export const FolderRow = ({folder, courseId}: FolderRowProps) => {
    const queryClient = useQueryClient();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [quizName, setQuizName] = useState("");
    const {createQuiz, isCreatingQuiz} = useQuiz();

    const handleCreateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Previene il toggle dell'espansione

        if (!quizName.trim()) return;

        try {
            await createQuiz(
                quizName.trim()
            );

            // Invalida la cache per forzare il refresh delle folder
            queryClient.invalidateQueries(["folders", courseId]);
            setQuizName("");
            setShowCreateForm(false);
        } catch (error) {
            console.error("Failed to create quiz", error);
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
                        {folder.quizzes?.length || 0} quizzes
                    </span>
                    {isExpanded ? <BsChevronUp/> : <BsChevronDown/>}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-base-200 p-4">
                    <QuizList
                        quizzes={folder.quizzes || []}
                        courseId={courseId}
                        folderId={folder.id!}
                    />

                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        {!showCreateForm ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCreateForm(true);
                                }}
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