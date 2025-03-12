import React, {useState, useEffect, useCallback} from 'react';
import { FolderDTO, QuizDTO } from '@dti-isin/backend-api-client';
import { BsFolder2, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { quizService } from '../../services/quizService';
import {QuizList} from "../quiz/QuizList.tsx";
import {useNavigate} from "react-router-dom";

interface FolderRowProps {
    folder: FolderDTO;
    courseId: string;
}

export const FolderRow = ({ folder, courseId }: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
    const [quizCount, setQuizCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [newQuizName, setNewQuizName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadQuizCount = useCallback(async () => {
        try {
            const data = await quizService.getQuizzesInFolder(courseId, folder.id!);
            setQuizCount(data.length);
        } catch (error) {
            console.error('Failed to load quiz count:', error);
        }
    }, [courseId, folder.id]);

    const loadQuizzes = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await quizService.getQuizzesInFolder(courseId, folder.id!);
            setQuizzes(data);
            setQuizCount(data.length);
        } catch (error) {
            console.error('Failed to load quizzes:', error);
            setError('Failed to load quizzes');
        } finally {
            setIsLoading(false);
        }
    }, [courseId, folder.id]);

    useEffect(() => {
        const initializeQuizCount = async () => {
            await loadQuizCount();
        };
        void initializeQuizCount();
    }, [loadQuizCount]);

    useEffect(() => {
        const loadQuizzesIfExpanded = async () => {
            if (isExpanded) {
                await loadQuizzes();
            }
        };
        void loadQuizzesIfExpanded();
    }, [isExpanded, loadQuizzes]);

    const handleCreateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuizName.trim()) return;

        try {
            setIsLoading(true);
            setError(null);

            const newQuiz = await quizService.createQuiz(
                courseId,
                folder.id!,
                newQuizName.trim()
            );
            await loadQuizzes();
            navigate(`/courses/${courseId}/folders/${folder.id}/quizzes/${newQuiz.id}/edit`);

        } catch (error) {
            console.error('Failed to create quiz:', error);
            setError('Failed to create quiz');
        } finally {
            setIsLoading(false);
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
                            {error}
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
                                folderId={folder.id!}
                                onQuizDeleted={loadQuizzes}
                            />

                            {/* Form per creare un nuovo quiz */}
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