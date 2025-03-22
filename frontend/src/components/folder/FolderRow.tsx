import { useState } from "react";
import { FolderDTO } from "@dti-isin/backend-api-client";
import { BsChevronDown, BsChevronUp, BsFolder2, BsPlus } from "react-icons/bs";
import { QuizList } from "../quiz/QuizList";
import { useNavigate } from "react-router-dom";

interface FolderRowProps {
    folder: FolderDTO;
    courseId: string;
}

export const FolderRow = ({ folder, courseId }: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const handleCreateQuiz = () => {
        navigate(`/courses/${courseId}/folders/${folder.id}/quizzes/new`);
    };

    return (
        <div className="bg-base-100 shadow-sm hover:shadow-md transition-all">
            <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <BsFolder2 className="text-xl text-primary" />
                    <h3 className="font-semibold">{folder.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-base-content/70">
                        {folder.quizzes?.length || 0} quizzes
                    </span>
                    {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-base-200 p-4">
                    <QuizList
                        quizzes={folder.quizzes || []}
                        courseId={courseId}
                        folderId={folder.id!}
                    />

                    <div className="mt-4">
                        <button
                            onClick={handleCreateQuiz}
                            className="btn btn-primary w-full"
                        >
                            <BsPlus className="text-xl mr-2" />
                            Add New Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};