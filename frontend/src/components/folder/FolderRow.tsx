import { useQuiz } from '../../hooks/useQuiz';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderDTO } from "@dti-isin/backend-api-client";
import { BsChevronDown, BsChevronUp, BsFolder2 } from "react-icons/bs";
import { QuizList } from "../quiz/QuizList.tsx";

interface FolderRowProps {
    folder: FolderDTO;
    courseId: string;
}

export const FolderRow = ({ folder, courseId }: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newQuizName, setNewQuizName] = useState('');
    const navigate = useNavigate();

    const {
        quizzes,
        isLoading,
        error,
        createQuiz,
        fetchQuizzes
    } = useQuiz();

    const quizCount = quizzes.length;

    useEffect(() => {
        if (isExpanded && folder.id) {
            fetchQuizzes();
        }
    }, [isExpanded, fetchQuizzes, folder.id]);

    const handleCreateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuizName.trim() || !folder.id) return;

        try {
            const newQuiz = await createQuiz(newQuizName.trim());
            if (newQuiz?.id) {
                navigate(`/courses/${courseId}/folders/${folder.id}/quizzes/${newQuiz.id}/edit`);
                setNewQuizName('');
            }
        } catch (error) {
            console.error('Failed to create quiz:', error);
        }
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
                        {quizCount} quizzes
                    </span>
                    {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-base-200 p-4">
                    {error && (
                        <div className="alert alert-error mb-4">
                            {error.message}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner"></span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <QuizList
                                quizzes={quizzes}
                                courseId={courseId}
                                folderId={folder.id || ""}
                            />

                            <form onSubmit={handleCreateQuiz} className="mt-4">
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        value={newQuizName}
                                        onChange={(e) => setNewQuizName(e.target.value)}
                                        placeholder="Enter quiz name"
                                        className="input input-bordered join-item flex-1"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary join-item"
                                        disabled={!newQuizName.trim() || isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            'Create Quiz'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};