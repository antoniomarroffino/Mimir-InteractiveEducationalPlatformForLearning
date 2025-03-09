import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QuizDTO, FolderDTO } from '@dti-isin/backend-api-client';
import { quizService } from '../services/quizService';
import { BsChevronRight } from 'react-icons/bs';
import { useCourseContext } from '../contexts/course/CourseContext';
import { folderService } from '../services/folderService';

export const QuizCreation: React.FC = () => {
    const { courseId, folderId, quizId } = useParams();
    const navigate = useNavigate();
    const { courses, selectedCourseId } = useCourseContext();

    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [folder, setFolder] = useState<FolderDTO | null>(null);
    const [quizName, setQuizName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentCourse = courses.find(course => course.id === selectedCourseId);

    useEffect(() => {
        const initializeData = async () => {
            if (!courseId || !folderId) return;

            try {
                setIsLoading(true);
                setError(null);

                // Carica la folder
                const folders = await folderService.getFoldersInCourse(courseId);
                const currentFolder = folders.find(f => f.id === folderId);
                if (currentFolder) {
                    setFolder(currentFolder);
                }

                // Carica il quiz se in modalità modifica
                if (quizId) {
                    const quizData = await quizService.getQuiz(courseId, folderId, quizId);
                    setQuiz(quizData);
                    setQuizName(quizData.name || '');
                }
            } catch (error) {
                console.error('Failed to load data:', error);
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [courseId, folderId, quizId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quizName.trim() || !courseId || !folderId) return;

        try {
            setIsSaving(true);
            setError(null);

            if (quizId && quiz) {
                await quizService.updateQuiz(courseId, folderId, quizId, {
                    ...quiz,
                    name: quizName.trim()
                });
            } else {
                await quizService.createQuiz(courseId, folderId, quizName.trim());
            }

            navigate(`/courses/${courseId}`);
        } catch (error) {
            console.error('Failed to save quiz:', error);
            setError('Failed to save quiz');
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentCourse || !courseId || !folderId) {
        return (
            <div className="alert alert-error">
                Invalid course or folder
                <button
                    className="btn btn-sm btn-outline ml-4"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-8">
                <ul className="flex items-center gap-2 text-sm">
                    <li>
                        <Link
                            to="/"
                            className="text-primary hover:text-primary-focus"
                        >
                            Home
                        </Link>
                    </li>
                    <BsChevronRight className="text-gray-400" />
                    <li>
                        <Link
                            to={`/courses/${courseId}`}
                            className="text-primary hover:text-primary-focus"
                        >
                            {currentCourse.name}
                        </Link>
                    </li>
                    {folder && (
                        <>
                            <BsChevronRight className="text-gray-400" />
                            <li>
                                <Link
                                    to={`/courses/${courseId}`}
                                    className="text-primary hover:text-primary-focus"
                                >
                                    {folder.name}
                                </Link>
                            </li>
                        </>
                    )}
                    <BsChevronRight className="text-gray-400" />
                    <li>
                        <span className="font-semibold">
                            {quiz ? quiz.name : 'New Quiz'}
                        </span>
                    </li>
                </ul>
            </div>

            <div className="bg-base-100 rounded-lg p-6 shadow-lg">
                <h1 className="text-2xl font-bold mb-6">
                    {quizId ? 'Edit Quiz' : 'Create New Quiz'}
                </h1>

                {error && (
                    <div className="alert alert-error mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Quiz Name</span>
                        </label>
                        <input
                            type="text"
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter quiz name"
                            disabled={isSaving}
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => navigate(`/courses/${courseId}`)}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!quizName.trim() || isSaving}
                        >
                            {isSaving ? (
                                <span className="loading loading-spinner"></span>
                            ) : quizId ? (
                                'Update Quiz'
                            ) : (
                                'Create Quiz'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};